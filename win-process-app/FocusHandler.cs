using System;
using System.Diagnostics;

namespace win_process_app {
    public static class FocusHandler {
        public const uint SW_SHOW = 5;
        public const int SW_RESTORE = 9;
        public static void SwitchToWindow (int processId) {
            var process = Process.GetProcessById (processId);
            if (process != null) {
                NativeMethods.BringWindowToTop (process.MainWindowHandle);
                NativeMethods.ShowWindow (process.MainWindowHandle, SW_SHOW);
                NativeMethods.ShowWindow (process.MainWindowHandle, SW_RESTORE);
                NativeMethods.SetForegroundWindow (process.MainWindowHandle);
                NativeMethods.SetForegroundWindow (process.MainWindowHandle);
            } else {
                throw new ArgumentException ("Unable to find process: " + processId.ToString ());
            }
        }
    }
}