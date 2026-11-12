@echo off
title Free AI Software Silent Lab Installer
echo Installing Scratch 3 Desktop and GCompris for School Lab...
if exist "%~dp0Scratch_3_Desktop_Setup.exe" (
  echo Installing Scratch 3 Desktop...
  start /wait "" "%~dp0Scratch_3_Desktop_Setup.exe" /S
)
if exist "%~dp0GCompris_Educational_Suite_Setup.exe" (
  echo Installing GCompris...
  start /wait "" "%~dp0GCompris_Educational_Suite_Setup.exe" /S
)
echo Installation complete!
pause
