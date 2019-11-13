﻿using System;
using System.Runtime.InteropServices;
using System.Text;

namespace win_process_app
{
    public static class NativeMethods
    {
        [DllImport("user32.dll")]
        public static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll")]
        public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);
        
         [DllImport("user32.dll")]
        public static extern IntPtr SetForegroundWindow(IntPtr hWnd);
    }
}
