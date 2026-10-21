#!/usr/bin/env python
"""Render the Berkeley Humanoid Lite open-source design (CC BY-SA 4.0) with MuJoCo.

Produces the stills and turntable frames used on the site: full robot, lower body, single leg,
an exploded 6512 cycloidal actuator, and 150 turntable frames.

Requirements: Python 3.10+, mujoco >= 3.3, Pillow, numpy, and
  * the course embodiment files (https://github.com/hbrnetwork/metal2humanoid, embodiments/berkeley-humanoid-lite)
  * the 6512 actuator STL parts from the Berkeley Humanoid Lite releases, copied to a folder with the
    names used in ORDER below (housing_rear.stl, motor_shell.stl, ...).

Usage:
  python tools/render-platform.py <output-dir> <actuator-parts-dir> [<path to embodiments/berkeley-humanoid-lite/xmls>]
Then crop/pad the PNGs for the web (see README) and encode the turntable with ffmpeg:
  ffmpeg -framerate 25 -i <output-dir>/frames/tt_%03d.png -c:v libx264 -crf 24 -pix_fmt yuv420p assets/video/bhl-turntable.mp4
"""

import os, sys, glob, struct, numpy as np, mujoco
from PIL import Image

OUT = sys.argv[1]; PARTS = sys.argv[2]
EMB = sys.argv[3] if len(sys.argv) > 3 else os.path.join(os.path.dirname(__file__), "..", "..", "metal2humanoid", "embodiments", "berkeley-humanoid-lite", "xmls")
os.makedirs(os.path.join(OUT, "frames"), exist_ok=True)
BG = (0.984, 0.980, 0.969)  # site background #FBFAF7

def add_lights(spec):
    for pos, dr, diff in [((2, -2.5, 3), (-0.45, 0.55, -0.7), (0.75, 0.75, 0.75)),
                          ((-3, -1.5, 2), (0.7, 0.35, -0.5), (0.4, 0.4, 0.42)),
                          ((0.5, 3, 2.5), (-0.1, -0.8, -0.6), (0.35, 0.35, 0.38))]:
        spec.worldbody.add_light(pos=pos, dir=dr, diffuse=diff, specular=(0.15, 0.15, 0.15),
                                 ambient=(0, 0, 0), type=mujoco.mjtLightType.mjLIGHT_DIRECTIONAL, castshadow=0)
    spec.visual.headlight.ambient[:] = (0.38, 0.38, 0.38)
    spec.visual.headlight.diffuse[:] = (0.25, 0.25, 0.25)
    spec.visual.headlight.specular[:] = (0.1, 0.1, 0.1)
    spec.visual.quality.offsamples = 8
    g = getattr(spec.visual, "global_", None) or getattr(spec.visual, "global")
    g.offwidth = 3200; g.offheight = 3200
    spec.add_texture(name="flatsky", type=mujoco.mjtTexture.mjTEXTURE_SKYBOX,
                     builtin=mujoco.mjtBuiltin.mjBUILTIN_FLAT, rgb1=BG, rgb2=BG, width=32, height=32)

def hide_planes(model):
    for i in range(model.ngeom):
        if model.geom_type[i] == mujoco.mjtGeom.mjGEOM_PLANE:
            model.geom_rgba[i, 3] = 0

def camera(lookat, dist, az, el):
    cam = mujoco.MjvCamera(); cam.type = mujoco.mjtCamera.mjCAMERA_FREE
    cam.lookat[:] = lookat; cam.distance = dist; cam.azimuth = az; cam.elevation = el
    return cam

def shoot(model, data, cam, w, h, path):
    r = mujoco.Renderer(model, height=h * 2, width=w * 2)
    opt = mujoco.MjvOption()
    r.update_scene(data, camera=cam, scene_option=opt)
    img = Image.fromarray(r.render().copy()).resize((w, h), Image.LANCZOS)
    r.close(); img.save(path); return img

def visible_bbox(model, data, keep):
    pts = []
    for i in range(model.ngeom):
        if model.geom_rgba[i, 3] > 0 and (keep is None or keep(i)):
            p = data.geom_xpos[i]; rb = model.geom_rbound[i]
            pts.append(p - rb); pts.append(p + rb)
    pts = np.array(pts); return pts.min(0), pts.max(0)

# ---------------- robot renders ----------------
def robot(xml, name, az=140, el=-12, hide_bodies=None, w=1200, h=1200, lookat=None, dist=None):
    spec = mujoco.MjSpec.from_file(os.path.join(EMB, xml)); add_lights(spec)
    model = spec.compile(); data = mujoco.MjData(model); mujoco.mj_forward(model, data)
    hide_planes(model)
    if hide_bodies:
        hidden = set()
        for b in range(model.nbody):
            bn = mujoco.mj_id2name(model, mujoco.mjtObj.mjOBJ_BODY, b) or ""
            if any(bn.startswith(p) for p in hide_bodies): hidden.add(b)
        for i in range(model.ngeom):
            if model.geom_bodyid[i] in hidden: model.geom_rgba[i, 3] = 0
    lo, hi = visible_bbox(model, data, None)
    c = (lo + hi) / 2; ext = np.linalg.norm(hi - lo)
    cam = camera(lookat if lookat is not None else c, dist or ext * 1.15, az, el)
    print(name, "bbox", np.round(lo, 2), np.round(hi, 2))
    shoot(model, data, cam, w, h, os.path.join(OUT, name + ".png"))
    return model, data, c, ext

robot("berkeley_humanoid_lite.xml", "bhl-humanoid", az=140, el=-10)
robot("berkeley_humanoid_lite.xml", "bhl-humanoid-front", az=180, el=-6)
robot("berkeley_humanoid_lite_biped.xml", "bhl-lower-body", az=140, el=-12)
robot("berkeley_humanoid_lite_biped.xml", "bhl-leg", az=120, el=-10, hide_bodies=["leg_right"])
robot("berkeley_humanoid_lite_biped.xml", "bhl-leg-only", az=120, el=-10, hide_bodies=["leg_right", "base", "imu"])

# turntable frames
model, data, c, ext = robot("berkeley_humanoid_lite.xml", "bhl-turntable-poster", az=140, el=-10, w=960, h=720)
r = mujoco.Renderer(model, height=1440, width=1920)
cam = camera(c, ext * 1.15, 140, -10)
N = 150
for k in range(N):
    cam.azimuth = 140 + 360.0 * k / N
    r.update_scene(data, camera=cam)
    Image.fromarray(r.render().copy()).resize((960, 720), Image.LANCZOS).save(os.path.join(OUT, "frames", f"tt_{k:03d}.png"))
r.close(); print("turntable frames", N)

# ---------------- actuator renders ----------------
def stl_bounds(p):
    with open(p, 'rb') as f:
        f.read(80); n = struct.unpack('<I', f.read(4))[0]
        data_ = np.frombuffer(f.read(n * 50), dtype=np.dtype([('n', '<f4', 3), ('v', '<f4', (3, 3)), ('a', '<u2')]))
    v = data_['v'].reshape(-1, 3); return v.min(0), v.max(0)

HOUSING = (0.84, 0.82, 0.78, 1); DARK = (0.22, 0.22, 0.24, 1); COPPER = (0.68, 0.32, 0.13, 1)
STEEL = (0.62, 0.64, 0.67, 1); OUTPUT = (0.52, 0.53, 0.55, 1)
# assembly order rear -> front for the exploded view: (file, color)
ORDER = [("housing_rear", HOUSING), ("motor_shell", DARK), ("motor_shaft", STEEL), ("input_shaft", STEEL),
         ("housing_middle", HOUSING), ("output_shaft_rear", OUTPUT), ("cycloidal_disk", COPPER),
         ("output_shaft_front", OUTPUT), ("housing_front", HOUSING)]

def actuator(name, exploded, az=-62, el=-18, w=1400, h=900):
    spec = mujoco.MjSpec(); spec.compiler.meshdir = PARTS; add_lights(spec)
    x = 0.0; gap = 0.014
    for part, color in ORDER:
        f = os.path.join(PARTS, part + ".stl"); lo, hi = stl_bounds(f)
        thick = (hi[2] - lo[2]) / 1000.0; zc = (lo[2] + hi[2]) / 2000.0
        spec.add_mesh(name=part, file=part + ".stl", scale=(0.001, 0.001, 0.001))
        if exploded:
            x += thick / 2
            # rotate part so its axis (z) points along +x, center it, place at x
            body = spec.worldbody.add_body(name=part, pos=(x, 0, 0), quat=(0.7071068, 0, 0.7071068, 0))
            body.add_geom(type=mujoco.mjtGeom.mjGEOM_MESH, meshname=part, rgba=color, pos=(0, 0, -zc))
            x += thick / 2 + gap
        else:
            body = spec.worldbody.add_body(name=part, pos=(0, 0, 0), quat=(0.7071068, 0, 0.7071068, 0))
            body.add_geom(type=mujoco.mjtGeom.mjGEOM_MESH, meshname=part, rgba=color)
    model = spec.compile(); data = mujoco.MjData(model); mujoco.mj_forward(model, data)
    lo, hi = visible_bbox(model, data, None); c = (lo + hi) / 2; ext = np.linalg.norm(hi - lo)
    cam = camera(c, ext * (1.05 if exploded else 1.4), az, el)
    shoot(model, data, cam, w, h, os.path.join(OUT, name + ".png")); print(name, "ok", np.round(hi - lo, 3))

actuator("actuator-exploded", True)
# assembled: only the parts that are aligned in the export (housings + motor shell + output front face)
ORDER = [("housing_rear", HOUSING), ("motor_shell", DARK), ("housing_middle", HOUSING), ("output_shaft_front", OUTPUT), ("housing_front", HOUSING)]
actuator("actuator-assembled", False, az=-55, el=-22, w=1200, h=1000)
print("done")
