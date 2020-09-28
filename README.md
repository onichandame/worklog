# Worklog

A personal logbook that requires no central server to synchronize between different devices.

# Author

[onichandame](https://onichandame.com)

# Problems to Solve

Much of the daily work is dealing with chores. Keeping a written track of all the tasks is essential to stay efficient. This tool is intended to solve the following issues.

1. Manage tasks
2. Synchronize data between devices

As a personal project aiming at learning distributed app development, this tool is not intended to provide the following functions:

1. Permanent data storage and backup
2. Collaboration
3. Anything expected in a fully-functional scheduler(such as Google Calendar) but not expected in a physical logbook.

A classical use case is:

- Wake up in the morning. Check the worklog on the smartphone to see if anything needs to be done before going to work
- Arrive at the office. Synchronize the worklog in the smartphone to the worklog in the computer. Modify the worklog during the working hours as needed
- Visit a client after lunch. Synchronize the worklog in the computer to the smartphone. Add pending tasks to worklog on smartphone during the visit

The whole idea is to store personal data locally on the user's device and synchronize data in a p2p channel to avoid the need of any central server.

# Design

The app should be compatible to at least desktop computers of any OS and Android smartphones. Hence browser-based webapp is the chosen approach.

To store the data, IndexedDB can be utilized. To secure the data, it is assumed that the devices holding the data are trusted by the user. Hence no application-level authentication is required.

The communication protocol should be based on p2p technology but the latency of a full synchronization should be low. Hence IPFS with some tweaks is the best choice.

## Architecture

### User Interface

The user is expected to
