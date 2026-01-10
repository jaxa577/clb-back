# How to Install Docker on Windows

## Step-by-Step Guide

### Step 1: Download Docker Desktop

1. Go to https://www.docker.com/products/docker-desktop/
2. Click **"Download for Windows"**
3. The download will start automatically (about 500MB)

### Step 2: Install Docker Desktop

1. Run the downloaded `Docker Desktop Installer.exe`
2. Follow the installation wizard:
   - ✅ Enable WSL 2 (recommended)
   - ✅ Add shortcut to desktop
3. Click "Install"
4. Wait for installation to complete (5-10 minutes)
5. Click "Close" when done

### Step 3: Start Docker Desktop

1. Open Docker Desktop from:
   - Desktop shortcut, OR
   - Start menu → Docker Desktop
2. Accept the Service Agreement
3. Wait for Docker Engine to start (whale icon in system tray)
4. You'll see "Docker Desktop is running" ✅

### Step 4: Verify Installation

Open a new terminal (Command Prompt or PowerShell) and run:

```bash
docker --version
```

You should see something like: `Docker version 24.0.0, build...`

### Step 5: Run Your Project

Now you can use the setup scripts:

```bash
cd C:\Users\Jaxa\Desktop\CLB-b-f\sng-loadboard-backend
setup.bat
```

---

## Troubleshooting

### "WSL 2 installation is incomplete"

1. Run PowerShell as Administrator
2. Execute:
   ```powershell
   wsl --install
   ```
3. Restart your computer
4. Start Docker Desktop again

### "Docker Engine failed to start"

1. Restart Docker Desktop:
   - Right-click Docker icon in system tray
   - Click "Restart"
2. If that doesn't work, restart your computer

### "Hyper-V is not enabled"

1. Open Control Panel
2. Programs → Turn Windows features on or off
3. Enable:
   - ✅ Hyper-V
   - ✅ Windows Subsystem for Linux
   - ✅ Virtual Machine Platform
4. Restart your computer

---

## Alternative: Use Cloud Database Instead

If Docker installation is problematic, use a **free cloud database**:

### Supabase (Recommended - Free Forever)

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or email
4. Create a new project:
   - Name: `sng-loadboard`
   - Database Password: Choose a strong password
   - Region: Choose closest to you
5. Wait 2-3 minutes for setup
6. Go to **Settings → Database**
7. Copy the **Connection string** (URI format)
8. Update your `.env` file:
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```
9. Continue with backend setup (skip docker-compose)

---

## System Requirements

- **Windows 10/11** (64-bit)
- **4GB RAM** minimum (8GB recommended)
- **20GB free disk space**
- **Virtualization enabled** in BIOS

---

## Still Having Issues?

Use the cloud database option (Supabase) - it's actually easier and doesn't require Docker at all!
