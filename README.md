# scales
An application for interacting with Adam CPWplus scales.

Connection between the scales and a PC requires Sabrent USB 2.0 to Serial Cable Adapters (Models: SBT-FTDI or CB-DB9P)
(https://goo.gl/4P24eP)

**Null Modem** serial cables are also required to connect the scales and cable adapters. 

Before this application may be used, the PC's  **MachineGuid** must be added to the list of approved machines.
This list is stored in Firestore/scales-fb/Admin/[your location]/Machines.

To find your Windows PC MachineGuid, open the registry editor (https://goo.gl/hxhTPL).

Then follow this file path: HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Cryptography

The MachineGuid will have the form: xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx
