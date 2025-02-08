!define APP_NAME "Excel Date Validator"
!define COMP_NAME "SAUNAK"
!define VERSION "1.0.0"
!define COPYRIGHT "SAUNAK"
!define DESCRIPTION "Excel Date Validator"
!define LICENSE_TXT "LICENSE.txt"
!define INSTALLER_NAME "ExcelDateValidator_Setup.exe"

Name "${APP_NAME}"
OutFile "${INSTALLER_NAME}"
InstallDir "$PROGRAMFILES\${APP_NAME}"
InstallDirRegKey HKCU "Software\${APP_NAME}" ""

!include "MUI2.nsh"

Section "MainSection" SEC01
    SetOutPath "$INSTDIR"
    SetOverwrite ifnewer
    File /r "dist\ExcelValidator\*.*"
    
    CreateDirectory "$SMPROGRAMS\${APP_NAME}"
    CreateShortCut "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk" "$INSTDIR\ExcelValidator.exe"
    CreateShortCut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\ExcelValidator.exe"
SectionEnd

Section -Post
    WriteUninstaller "$INSTDIR\uninst.exe"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "DisplayName" "${APP_NAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" "UninstallString" "$INSTDIR\uninst.exe"
SectionEnd