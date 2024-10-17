# SSRPM - WEB APP

## 1. Overview Statement

### 1.1 Purpose
This document outlines the information, system rules, and current workflow for managing student scientific research projects at Van Lang University. It provides an overview of the existing system within the Scientific Research Development Department, facilitating smoother interactions among administrators, teachers, and students.

### 1.2 Necessity of the Student Scientific Research Projects Management Application
The Student Scientific Research Projects Management Application aims to streamline the management of student research initiatives. It allows students easy access to scientific research resources, fostering creativity and discovery. Additionally, the application enables management units to efficiently monitor, approve, and support students’ research projects, enhancing the communication between students and administrative bodies.

### 1.3 Goals of the Project
The goal of this project is to develop a management application that assists students throughout the research process—from registering research topics to drafting outlines, obtaining approvals, and reporting findings. This software will enable the Scientific Research Development Department to effectively manage student projects, saving time and improving efficiency. Key objectives include:

- Creating a user-friendly interface for three user types: students, teachers, and administrators.
- Ensuring the interface is intuitive and easy to navigate.
- Including all essential features aligned with Van Lang University's current scientific research procedures.
- Delivering the project within the established schedule and budget.

### 1.4 Scope of the Project’s Product
The proposed system will fully support the management of student research at Van Lang University. It will feature a well-defined software architecture to address these needs and utilize a clear software development methodology to ensure scalability throughout the development process.

## 2. Software Architecture Specification

### 2.1 Purpose
The purpose of this Software Architecture Specification (SAS) is to provide a comprehensive and detailed description of the architecture of the Student Scientific Research Projects Management (SSRPM) system. The SSRPM is designed to build, develop, and deploy a software product based on the existing Research Management System at Van Lang University. This document outlines how the components of the software system are assembled, their relationships, and the communication protocols between them. It serves as a blueprint for the software application and a foundational reference for the development team.

### 2.2 Common Notation
The following notations are used throughout this document:

| Notation | Type | Description |
|----------|------|-------------|
| ![image](https://github.com/user-attachments/assets/f98d7af0-9e1a-43c9-b919-bc6502ad6364) | UML | A logical grouping of physical artifacts in the system, including namespaces, projects, classes, methods, etc. |
| ![image](https://github.com/user-attachments/assets/02633be1-a341-4043-926e-0fcec08ae216) | UML | A self-contained unit of software that encapsulates related functions or features, which may include classifiers, associations, actions, lifelines, components, and packages. |
| ![image](https://github.com/user-attachments/assets/842c5bce-2b69-48de-bc3d-114df88fcc04) | UML | A definition of objects that share specific structural or behavioral characteristics, encapsulating data and behaviors. |
| ![image](https://github.com/user-attachments/assets/d1971fd7-d5ae-404a-adf2-5b55c7d5a4f5) | UML | A reusable piece of system functionality that provides and consumes behavior through interfaces. |

## 2.3 Project Overview

![image](https://github.com/user-attachments/assets/890e6dba-a6fc-4ce2-ae2b-a04a2e6cb47f)

The SSRPM (Student Scientific Research Projects Management) application is tailored to meet the needs of teachers and students involved in research projects. It offers comprehensive support for registering and managing research processes within a software-intensive environment.

Designed for educators and students requiring assistance in managing research endeavors, SSRPM provides a specialized platform that facilitates the registration and oversight of various phases and processes associated with research projects.


### Key Functionalities of SSRPM include:
- **Registration and Management:** Users can register new research projects and manage them effectively.
- **Approval Workflow:** Teachers have the capability to approve research projects, ensuring compliance with academic standards.
- **Research Room Management:** The platform enables the management of teachers, students, and all associated research projects within designated research rooms.
- **Process Tracking:** SSRPM tracks the progress of research projects, allowing users to monitor each phase of the research process.
- **Publication Management:** It facilitates the management of scientific publications related to research projects.
- **Committee Management:** Users can efficiently manage committees associated with research projects.
- **Reporting and Statistics:** The application generates standard reports and statistical analyses for each research project, aiding in performance evaluation and decision-making.
- **Report Management:** SSRPM includes robust functionalities for managing research project reports. Users can create, upload, review, and approve reports within the system. Additionally, completed research reports can be archived for future reference.

## 2.4 System context
![image](https://github.com/user-attachments/assets/a214d092-8eca-457e-8eb3-43267a63c40a)

## 2.5 Architectural patterns
| ID    | Architecture                           | Name Pattern                         | Description                                                                                       |
|-------|----------------------------------------|-------------------------------------|---------------------------------------------------------------------------------------------------|
| DP-1  | Layered System                         | Model-View-Controller (MVC)        | Separates the application into three layers: Model (represents system data), View (user interface), and Controller (handles application logic). |
| DP-2  | Client-Server Architecture             | RESTful API (Representational State Transfer) | Uses RESTful APIs to serve and consume data, providing endpoints that facilitate interaction between application layers. |
| DP-3  | Event-Driven Architecture              | Event Sourcing                      | Stores and recreates the state of the system by recording all events, enhancing system reliability and enabling recovery after failures. |
| DP-4  | Domain-Driven Design (DDD) - Microservices | Bounded Context                    | Defines the scope and responsibilities of each service, creating clarity and simplicity in development and management. |
| DP-5  | Cache Pattern                          |                                     | Stores frequently accessed data to improve performance.                                           |
| DP-6  | Asynchronous Processing Pattern        |                                     | Handles requests concurrently to increase system throughput.                                      |

## 2.6 Quality Attribute Tactics
| Quality Attribute | Tactic                            | Description                                                                                     |
|-------------------|-----------------------------------|-------------------------------------------------------------------------------------------------|
| Maintainability    | Modularity & Encapsulation        | Creates independent, reusable modules in the system.                                           |
|                   | Separation of Concerns            | Divides the system into smaller parts for easier management and maintenance.                    |
| Modifiability      | Scalability                       | Ensures the system can optimize improvements and easily integrate new modules as needed.        |
| Performance        | Parallelism and Concurrency       | Combines parallel task processing to improve user response time and reduce latency.             |
|                   | Database Optimization             | Reduces processing time required to retrieve data through effective database management.         |
|                   | Code Optimization                 | Regularly reviews and optimizes code to eliminate bottlenecks and enhance efficiency.           |
| Security           | Authentication & Authorization    | Protects the system from unauthorized disclosure and modification.                              |
|                   | Encryption & Decryption           | Encrypts sensitive data both at rest and in transit to safeguard against breaches.             |
| Reliability        | Consistency                       | Ensures data remains consistent, preventing changes during transfers between users.             |
| Usability          | User Interface Design             | Designs a user-friendly interface that is intuitive and easy to navigate.                       |
|                   | Accessibility                     | Ensures interfaces are readable and usable for everyone, including those with visual impairments, by using high-contrast colors and descriptive elements for multimedia. |

## 2.7 Architectural structure

### Static View
![image](https://github.com/user-attachments/assets/86b6db7d-1d7c-466b-99e6-01ea5ab31f91)

### Dynamic View
![image](https://github.com/user-attachments/assets/e29d2637-f53e-4f58-ab26-a3cdb81d041a)

### Physical View
![image](https://github.com/user-attachments/assets/cfb67213-6107-4029-90dc-2eda3cb38b52)

## 2.8 Software design methodology
![image](https://github.com/user-attachments/assets/b89ea428-3481-4a79-9c6a-80ad0cc49178)

## 2.8 Design method - ACDM
![image](https://github.com/user-attachments/assets/a61d1a17-18a3-4a89-8f71-289c5aa36623)





