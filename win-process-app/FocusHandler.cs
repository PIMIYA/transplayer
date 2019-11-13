using System;
using System.Diagnostics;

namespace win_process_app
{
    public static class FocusHandler
    {
        public static void SwitchToWindow(int processId)
        {
            var process = Process.GetProcessById(processId);
            if(process != null)
            {
                NativeMethods.SetForegroundWindow(process.MainWindowHandle);
            }
            else
            {
                throw new ArgumentException("Unable to find process: " + processId.ToString());
            }
        }
    }
}
