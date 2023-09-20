@echo off

REM Get the current script directory
set "scriptDir=%~dp0"

REM Step 1: Navigate to the root of the "src" folder
cd /d "%scriptDir%src"

REM Step 2: Install dependencies in each subfolder
for %%i in ("apiCRUD", "authen", "socket", "userImage", "web", "chat") do (
    echo Installing dependencies in %%i...
    pushd "%%i"
    npm i -y
    popd
)
echo Setup completed.
