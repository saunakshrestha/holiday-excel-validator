# -*- mode: python ; coding: utf-8 -*-
import os
import sys

block_cipher = None

a = Analysis(
    ['launcher.py'],
    pathex=[os.path.dirname(os.path.abspath(SPEC))],
    binaries=[],
    datas=[
        ('../backend', 'backend'),
        ('config.ini', '.'),
        ('README.txt', '.'),
        ('resources/database', 'resources/database'),
    ],
    hiddenimports=[
        'flask',
        'sqlalchemy',
        'pandas',
        'flask_sqlalchemy',
        'flask_migrate',
        'flask_cors',
        'holidays',
        'holidays.nepal',
        'openpyxl',
        'xlrd',
        'sqlite3',
        'PyQt6',
        'PyQt6.QtCore',
        'PyQt6.QtWidgets',
        'PyQt6.QtGui',
        'requests',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='ExcelValidator',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    target_arch=None,
    icon='resources/icons/app.ico'
)

# Mac specific
if sys.platform == 'darwin':
    app = BUNDLE(
        exe,
        name='ExcelValidator.app',
        icon='resources/icons/app.icns',
        bundle_identifier='com.saunak.excelvalidator'
    )