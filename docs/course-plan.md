# Metal2Humanoid — MIT IAP 2027 Course Plan

January 4–29, 2027 | 20 students | 6 teams of 2–4

Format: 12 integrated lecture-lab sessions over four weeks, tentatively Tuesday, Thursday, and Friday. Sessions are approximately 3 hours, with additional supervised lab time as needed.

Location: One primary robotics lab for instruction and hands-on work, plus a larger venue for the final showcase.

## Course Goals

Students will learn humanoid robotics by building actuators, assembling a humanoid, and developing robot skills.

By the end of the course, students will:

1. Individually assemble, calibrate, and test a functional actuator.
2. Demonstrate coordinated actuator control through a prepared BHL by the end of Week 1.
3. Assemble and commission the full Metal2Humanoid, targeting walking by the end of Week 2.
4. Develop and evaluate locomotion, manipulation, and other robot skills.
5. Integrate learned and programmed skills into coordinated robot behaviors.
6. Present their work at a public final showcase featuring both humanoid platforms.

The course will use Berkeley Humanoid Lite (BHL) as the actuator and introductory robotics platform, progressing to a larger custom Metal2Humanoid.

## Course Organization

### Teams

- 6 teams of 2–4 students.
- Every student completes an individual actuator assembly.
- Teams share responsibility for humanoid assembly, software development, and testing.
- Team responsibilities may change as the course progresses.

### Session Structure

Each approximately 3-hour session combines:

- 20–40 minutes of lecture and demonstrations.
- 90–120 minutes of guided hands-on work.
- Remaining time for testing, debugging, and discussion.

All sessions take place in the same lab. Additional open lab time may be scheduled for assembly, testing, and integration.

---

# Week 1 — EARTH: Motors, Gearboxes & Actuators

Goal: Every student builds an actuator. The class demonstrates coordinated walking motion using student-built actuators.

### Session 1 — Tuesday, January 5

Motor Fundamentals & Actuator Architecture

Topics:

- BLDC motors, torque, speed, current, and power.
- Motor drivers and electrical safety.
- Actuator design and mechanical interfaces.
- Introduction to BHL actuators.

Lab:

- Inspect actuator components.
- Explore motor characteristics.
- Run a Python motor-modeling notebook.
- Begin individual actuator assembly.

Assignment: Model a motor and plot its torque-speed curve.

### Session 2 — Thursday, January 7

Gearboxes, Encoders & Feedback Control

Topics:

- Cycloidal gearboxes.
- Bearings, shafts, and mechanical tolerances.
- Encoders and position sensing.
- PID control and calibration.

Lab:

- Complete individual actuator assembly.
- Install prepared electronics and wiring.
- Inspect mechanical alignment.
- Calibrate and test actuators.
- Implement basic position control.

Instructor preparation:

- Fabricate all mechanical parts beforehand.
- Preflash controllers.
- Pre-solder components where appropriate.
- Prepare shared testing stations and replacement parts.

### Session 3 — Friday, January 8

Actuator Control & Walking Demonstration

Topics:

- Coordinated joint motion.
- Trajectory generation.
- Joint synchronization.
- Basic gait patterns.

Lab:

- Complete any remaining actuator testing.
- Integrate selected student-built actuators into a prepared BHL-like walking mechanism.
- Execute coordinated joint trajectories.
- Demonstrate walking motion.
- Measure actuator performance.

Week 1 milestone:

- 20 student-built actuators.
- One walking demonstration using student-built actuators.

The demonstration hardware and walking controller must be validated before IAP.

---

# Week 2 — WATER: Kinematics, Dynamics & Humanoid Assembly

Goal: Assemble and commission the full Metal2Humanoid, targeting walking by Friday. Remaining walking validation may extend into Week 3.

### Session 4 — Tuesday, January 12

Robot Modeling, Kinematics & Assembly

Topics:

- Degrees of freedom and joint configurations.
- Forward and inverse kinematics.
- Coordinate frames.
- URDF and robot modeling.
- Humanoid mechanical architecture.

Lab:

- Explore the robot simulation and URDF.
- Begin assembly of assigned humanoid subsystems.
- Install actuators, brackets, and links.
- Inspect mechanical alignment and joint limits.
- Compare physical assemblies with CAD models.

Six-team assembly structure:

- Team 1: Left leg.
- Team 2: Right leg.
- Team 3: Left arm.
- Team 4: Right arm.
- Team 5: Torso and central mechanical assembly.
- Team 6: System integration, electronics, and bring-up.

Team 6 coordinates electrical interfaces, joint identification, subsystem testing, and integration with the other five teams.

Assignment: Implement forward/inverse kinematics and basic end-effector motion.

### Session 5 — Thursday, January 14

Dynamics, Balance & Robot Commissioning

Topics:

- Robot dynamics.
- Center of mass and stability.
- Joint-level feedback control.
- Trajectory generation.
- Walking controllers.
- Power, communications, and safety.

Lab:

- Continue mechanical assembly.
- Connect prepared wiring and communication interfaces.
- Verify joint IDs and configurations.
- Test joints and limbs independently.
- Perform supported-motion tests.
- Load and evaluate pretrained controllers.

### Session 6 — Friday, January 15

Whole-Body Integration & Walking

Topics:

- Whole-body coordination.
- Balance and locomotion control.
- Sim-to-real differences.
- Debugging mechanical and control failures.

Lab:

- Complete humanoid integration.
- Validate joint configurations and communication.
- Perform supported standing and walking tests.
- Attempt supervised walking demonstrations.
- Record and resolve integration issues.

Week 2 milestone:

- One assembled Metal2Humanoid.
- Completed subsystem and safety checks.
- Supported standing and walking tests.
- Walking demonstration targeted by the end of the week.

If walking validation requires additional time, debugging continues into Week 3 without delaying the software curriculum.

---

# Week 3 — FIRE: Robot Learning & Skills

Goal: Develop robot skills in simulation and deploy them to the humanoids where feasible.

### Session 7 — Tuesday, January 19

Reinforcement Learning & Locomotion

Topics:

- Markov decision processes.
- Reinforcement learning and PPO.
- Reward design.
- Locomotion training.
- Policy evaluation.

Lab:

- Run humanoid locomotion simulations.
- Evaluate pretrained walking policies.
- Modify rewards and controller parameters.
- Train or fine-tune a locomotion policy.
- Compare simulated and physical performance.
- Continue physical walking validation if necessary.

Assignment: Train or fine-tune a locomotion policy and evaluate its performance.

### Session 8 — Thursday, January 21

Imitation Learning & Sim-to-Real

Topics:

- Behavior cloning.
- Demonstration datasets.
- Diffusion policies.
- Vision-language-action models.
- Domain randomization.
- Sim-to-real transfer.

Lab:

- Collect or inspect demonstration data.
- Train or adapt a simple imitation-learning policy.
- Test skills in simulation.
- Deploy selected behaviors to hardware where feasible.
- Compare learned and programmed behaviors.

### Session 9 — Friday, January 22

Robot Skills Development

Topics:

- Skill interfaces.
- Skill preconditions and termination conditions.
- Success and failure detection.
- Reusable robot behaviors.
- Execution monitoring.

Lab:

- Each team develops a robot skill or behavior.
- Test skills in simulation.
- Deploy feasible skills to physical hardware.
- Evaluate reliability.
- Integrate skills into a shared library.
- Select final showcase demonstrations.

Example skills:

- Standing and balancing.
- Walking to a target.
- Turning.
- Arm positioning and reaching.
- Gestures.
- Simple manipulation.
- Recovery behaviors.

Week 3 milestone:

- Walking and control functionality validated or actively refined.
- Six team-developed skills or behaviors.
- Initial deployment of skills to physical hardware.
- Shared robot skill library.

---

# Week 4 — AIR: Planning, Integration & Showcase

Goal: Combine skills into coordinated behaviors and demonstrate the two humanoids at a public event.

### Session 10 — Tuesday, January 26

Robot Skills & Task Planning

Topics:

- Hierarchical robot control.
- Predicates and abstract states.
- Preconditions and effects.
- Symbolic planning.
- Skill sequencing.
- Task and motion planning.

Lab:

- Implement a basic task planner.
- Define skill preconditions and effects.
- Sequence multiple skills.
- Test execution and recovery.
- Connect planners to the shared skill library.

Assignment: Implement skill sequencing or a simple task-and-motion planner.

### Session 11 — Thursday, January 28

Task and Motion Planning & Final Integration

Topics:

- Geometric constraints.
- Motion planning.
- Bilevel planning.
- Learned skill integration.
- Robust execution.

Lab:

- Integrate team-developed skills.
- Test complete robot demonstrations.
- Validate hardware and software interfaces.
- Rehearse final presentations.
- Complete safety checks.
- Prepare backup demonstrations.

### Session 12 — Friday, January 29

Metal2Humanoid Public Showcase

The final session will take place in a larger venue suitable for robot demonstrations and an invited audience.

Activities:

- Introduction to Metal2Humanoid.
- Demonstration of student-built actuators.
- BHL walking and skills demonstration.
- Metal2Humanoid walking and skills demonstration.
- Six team presentations.
- Interactive demonstrations where safe.
- Closing discussion and networking.

Each team presents:

- Its technical contribution.
- The hardware or software it developed.
- A live or recorded demonstration.
- Results and lessons learned.

Week 4 milestone:

- Two humanoid platforms demonstrated.
- Integrated robot skills and planning.
- Six team presentations.
- One public final showcase.

Live demonstrations will depend on robot readiness and safety approval. Recorded and simulation backups will be prepared.

---

# Hardware & Kits

## Kit A — Individual Actuator Assembly

20 kits, one per student.

Each kit contains:

- Motor.
- Cycloidal gearbox components.
- Bearings, spacers, and shafts.
- Housing and fasteners.
- Encoder.
- Motor controller.
- Wiring and connectors.
- Parts tray and assembly guide.

Instructor preparation:

- Fabricate mechanical parts.
- Prepare electronics and firmware.
- Pre-solder difficult components where necessary.
- Prepare calibration and testing stations.
- Maintain spare motors, controllers, and mechanical components.

Student-built actuators will be reused in subsequent demonstrations and robot assembly where compatible.

## Kit B — BHL Demonstration & Integration

Components:

- Student-built actuators.
- Prepared BHL-compatible mechanical structures.
- Controller and communication interfaces.
- Power supply.
- Sensors.
- Walking support fixture.
- Validated gait controller.

The Week 1 demonstration should use existing prepared hardware rather than requiring a separate complete set of actuators.

Additional components required for BHL demonstrations and the final showcase will be determined from the final hardware configuration.

## Kit C — Metal2Humanoid Assembly

One custom humanoid, provisionally 26 DOF.

Central robot components:

- 6 hip actuators.
- 2 waist actuators.
- 2 neck actuators.
- Torso, pelvis, and head.
- Central electronics.
- Power distribution.
- Compute and communication interfaces.

Limb components:

- 2 legs with 3 actuators below the hip each: 6 actuators.
- 2 arms with 5 actuators each: 10 actuators.

Total installed actuators: 26.

Additional components:

- Structural parts.
- Bearings and mechanical interfaces.
- Brackets and linkages.
- Fasteners.
- Wiring and connectors.
- Sensors.
- Robot support fixture.

Instructor preparation:

- Finalize CAD and actuator selection.
- Validate mechanical interfaces.
- Prepare central electronics and power systems.
- Fabricate structural parts.
- Prepare six team assembly work packages.
- Test individual actuators and subsystems.
- Validate walking software before IAP.

---

# Preliminary Inventory

Final quantities must be confirmed against the frozen robot designs and the extent to which student-built actuators are reused.

## Individual Actuator Kits

- 20 individual student actuator kits.
- 10–20% additional quantities of failure-prone components.
- Spare motors, controllers, encoder boards, connectors, and gearbox parts.
- Pre-soldered replacement electronics where appropriate.

## BHL Demonstration Hardware

- Prepared walking demonstration mechanism.
- Student-built actuators reused where practical.
- Additional actuators only where required by the final configuration.
- Controllers, power, sensors, and communication interfaces.
- Mechanical support and testing equipment.

BHL actuator quantities must be counted based on actual simultaneous hardware requirements. Actuators reused between demonstrations and assemblies should not be counted twice.

## Metal2Humanoid

- 26 installed actuators, subject to final design confirmation.
- Approximately 3–6 spare actuators or equivalent critical replacement components.
- Prefabricated structural parts.
- Power, compute, sensors, and communication hardware.
- Mechanical and electrical replacement parts.

## Shared Teaching Equipment

- 6 team workstations.
- 20 individual actuator assembly trays.
- 4–8 protected actuator testing stations.
- Hex keys, screwdrivers, and assembly tools.
- Soldering equipment and appropriate ventilation.
- Electrical test equipment.
- 3D printers and workshop supplies.
- Spare connectors, fasteners, and wiring.
- Robot support fixtures and safety equipment.
- Shared computing/GPU resources.
- Simulation environments and pretrained policies.

Spare-parts policy: Procure 10–20% extra quantities for failure-prone components, particularly motors, controllers, electronics, connectors, and printed mechanical parts. Not every spare must be a complete actuator.

---

# Critical Preparation Before January

## Hardware

1. Freeze actuator and humanoid designs.
2. Confirm the final bill of materials and supplier availability.
3. Procure 20 individual actuator kits and appropriate spare parts.
4. Fabricate all required mechanical components.
5. Prepare electronics, wiring, and firmware.
6. Build and validate the Week 1 walking demonstration mechanism.
7. Prepare and test the humanoid assembly subsystems.
8. Validate robot power and communication systems.
9. Prepare walking controllers and safety fixtures.
10. Rehearse the complete assembly and testing process.

## Software

1. Prepare motor-modeling and actuator-control notebooks.
2. Validate robot simulation environments.
3. Prepare kinematics and dynamics exercises.
4. Prepare pretrained locomotion checkpoints.
5. Prepare RL and imitation-learning exercises.
6. Implement shared robot skill interfaces.
7. Prepare planning and skill-sequencing exercises.
8. Test hardware deployment and recovery procedures.
9. Prepare simulation and recorded demonstration backups.

## Logistics

1. Assign students to six teams.
2. Reserve one lab for integrated lecture-lab sessions.
3. Confirm additional supervised lab access.
4. Finalize assembly instructions and safety checklists.
5. Rehearse each major lab activity.
6. Reserve a larger venue for the January 29 showcase.
7. Prepare demonstration stations and presentation equipment.
8. Arrange invitations and event logistics.
9. Confirm final demonstration safety procedures.

---

# Feasibility & Contingencies

### Week 1

Individual actuator assembly requires prefabricated parts, prepared electronics, and rehearsed instructions.

Students should work simultaneously, with powered testing performed at supervised stations.

### Week 2

Full humanoid assembly and walking is an ambitious milestone.

The mechanical design, electronics, control interfaces, and walking software should be validated before January. The course focuses on assembly, integration, testing, and understanding the system rather than developing an untested robot from scratch.

Walking validation may extend into Week 3.

### Week 3

Skills development begins on schedule even if physical robot debugging continues.

Simulation and pretrained policies ensure that hardware delays do not block software progress.

### Week 4

The final showcase will feature both humanoid platforms, with live demonstrations selected according to their readiness and safety.

Every team should prepare a recorded or simulated backup.

---

# Final Course Milestones

EARTH — Week 1

- 20 student-built actuators.
- Walking demonstration using student-built hardware.

WATER — Week 2

- One assembled Metal2Humanoid.
- Robot commissioning and initial walking tests.
- Walking validation may continue into Week 3.

FIRE — Week 3

- Six team-developed robot skills.
- Locomotion and imitation-learning experiments.
- Initial hardware deployment.

AIR — Week 4

- Integrated robot skills and planning.
- Demonstrations featuring BHL and Metal2Humanoid.
- Six team presentations.
- Public showcase on January 29.

Overall outcome: Students experience the full humanoid robotics pipeline—from motors and gearboxes to robot assembly, locomotion, learning, planning, and system integration—culminating in a public demonstration of their work.
