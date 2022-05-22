@echo off
echo Opening port...
start "" http://localhost:3000
cd /d "G:\Storage\.Storage Vault\Project Archive\Ace IT\AceDashboard"
node index.js
pause