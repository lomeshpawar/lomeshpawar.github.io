@echo off
setlocal enabledelayedexpansion

set "PATH=C:\Users\user\AppData\Local\Programs\MinGit\cmd;C:\Users\user\AppData\Local\Programs\bin;%PATH%"

echo ========================================================
echo       LOMESH PAWAR PORTFOLIO - GITHUB DEPLOYMENT
echo ========================================================
echo.

rem Check gh authentication
gh auth status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [1/3] Please authenticate with GitHub:
    echo A browser window will open, or follow instructions in terminal.
    echo.
    gh auth login --hostname github.com -p https --web
    if %ERRORLEVEL% NEQ 0 (
        echo GitHub authentication failed or was cancelled.
        pause
        exit /b 1
    )
) else (
    echo [1/3] Already authenticated with GitHub.
)

echo.
echo [2/3] Checking / creating repository on GitHub...

rem Check if lomeshpawar.github.io or portfolio
set /p REPO_NAME="Enter repository name (default: lomeshpawar.github.io): "
if "%REPO_NAME%"=="" set "REPO_NAME=lomeshpawar.github.io"

rem Check if repo exists
gh repo view lomeshpawar/%REPO_NAME% >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Creating public repository lomeshpawar/%REPO_NAME% on GitHub...
    gh repo create %REPO_NAME% --public --source=. --remote=origin --push
) else (
    echo Repository exists. Configuring remote and pushing...
    git remote remove origin >nul 2>&1
    git remote add origin https://github.com/lomeshpawar/%REPO_NAME%.git
    git push -u origin main
)

echo.
echo [3/3] Enabling GitHub Pages...
gh api --method POST -H "Accept: application/vnd.github+json" /repos/lomeshpawar/%REPO_NAME%/pages -f "source[branch]=main" -f "source[path]=/" >nul 2>&1

echo.
echo ========================================================
echo Deployment Complete!
if "%REPO_NAME%"=="lomeshpawar.github.io" (
    echo Your portfolio will be live at: https://lomeshpawar.github.io/
) else (
    echo Your portfolio will be live at: https://lomeshpawar.github.io/%REPO_NAME%/
)
echo ========================================================
echo.
pause
