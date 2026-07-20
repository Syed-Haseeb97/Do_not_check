import { UAParser } from 'ua-parser-js';

// Vercel Serverless Function to log visitor details to Discord with high accuracy
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      messageId,
      name,
      screen,
      viewport,
      devicePixelRatio,
      colorDepth,
      orientation,
      theme,
      touch,
      language,
      allLanguages,
      cookiesEnabled,
      doNotTrack,
      onlineStatus,
      url,
      referrer,
      pageTitle,
      cpuCores,
      deviceMemory,
      maxTouchPoints,
      hardwareConcurrency,
      timeZone,
      localTime,
      
      // Prank Analytics
      timeBeforeRickroll,
      totalTimeOnPage,
      failedClicks,
      questionsAnswered,
      wrongAnswers,
      correctAnswers,
      scrollPercentage,
      mouseMovements,
      keyboardPresses,
      windowResizes,
      tabVisibilityChanges,
      focusBlurEvents,
      refreshCount,
      rickrollStarted,
      rickrollCompleted,
      timeWatched,
      
      // Network Info
      connectionType,
      effectiveType,
      downlink,
      rtt,
      saveData
    } = req.body || {};

    // Helper to sanitize values, defaulting to "Unknown"
    const clean = (val, fallback = "Unknown") => {
      if (val === undefined || val === null || val === "" || String(val).trim() === "") {
        return fallback;
      }
      return String(val).trim();
    };

    const visitorName = clean(name);

    // Extract IP address from request headers
    const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'Unknown';
    // Clean up forwarded IP list if multiple exist
    const cleanIp = ip && ip !== 'Unknown' ? ip.split(',')[0].trim() : 'Unknown';

    // Parse user agent using ua-parser-js
    const ua = req.headers['user-agent'] || '';
    const parser = new UAParser(ua);
    const result = parser.getResult();

    // Browser details
    const browserName = clean(result.browser.name);
    const browserVer = clean(result.browser.version);
    const browserString = browserName !== "Unknown"
      ? (browserVer !== "Unknown" ? `${browserName} ${browserVer}` : browserName)
      : "Unknown";

    // OS details
    const osName = clean(result.os.name);
    const osVer = clean(result.os.version);
    const osString = osName !== "Unknown"
      ? (osVer !== "Unknown" ? `${osName} ${osVer}` : osName)
      : "Unknown";

    // Device Category (Desktop / Mobile / Tablet)
    let deviceType = "Desktop";
    if (result.device.type === 'mobile') {
      deviceType = "Mobile";
    } else if (result.device.type === 'tablet') {
      deviceType = "Tablet";
    } else if (result.device.type) {
      deviceType = result.device.type.charAt(0).toUpperCase() + result.device.type.slice(1);
    }

    const deviceModel = clean(result.device.model);
    const deviceVendor = clean(result.device.vendor);
    const cpuArch = clean(result.cpu.architecture);

    const finalScreen = clean(screen);
    const finalViewport = clean(viewport);
    const finalPixelRatio = clean(devicePixelRatio);
    const finalColorDepth = clean(colorDepth);
    const finalOrientation = clean(orientation);
    const finalTheme = clean(theme);
    const finalTouch = clean(touch);
    const finalLanguage = clean(language);
    const finalAllLanguages = clean(allLanguages);
    const finalCookiesEnabled = clean(cookiesEnabled);
    const finalDoNotTrack = clean(doNotTrack);
    const finalOnlineStatus = clean(onlineStatus);
    const finalUrl = clean(url);
    const finalReferrer = clean(referrer);
    const finalPageTitle = clean(pageTitle);

    const finalCpuCores = clean(cpuCores);
    const finalMemory = clean(deviceMemory);
    const finalTouchPoints = clean(maxTouchPoints);
    const finalConcurrency = clean(hardwareConcurrency);
    const finalTimeZone = clean(timeZone);
    const finalLocalTime = clean(localTime);

    // Prank Analytics
    const finalTimeBeforeRR = clean(timeBeforeRickroll);
    const finalTotalTime = clean(totalTimeOnPage);
    const finalFailedClicks = clean(failedClicks, "0");
    const finalQuestions = clean(questionsAnswered, "0");
    const finalWrong = clean(wrongAnswers);
    const finalCorrect = clean(correctAnswers);
    const finalScroll = clean(scrollPercentage, "0");
    const finalMouse = clean(mouseMovements, "0");
    const finalKeyboard = clean(keyboardPresses, "0");
    const finalResizes = clean(windowResizes, "0");
    const finalTabs = clean(tabVisibilityChanges, "0");
    const finalFocusBlur = clean(focusBlurEvents, "0");
    const finalRefresh = clean(refreshCount, "1");
    const finalRRStarted = clean(rickrollStarted, "No");
    const finalRRCompleted = clean(rickrollCompleted, "No (Abandoned before video play)");
    const finalRRTimeWatched = clean(timeWatched, "0s");

    // Network Info
    const finalConnType = clean(connectionType);
    const finalEffType = clean(effectiveType);
    const finalDownlink = clean(downlink);
    const finalRtt = clean(rtt);
    const finalSaveData = clean(saveData, "Disabled");

    // Current ISO timestamp
    const isoTimestamp = new Date().toISOString();

    // Construct the elegant Discord embed
    const embed = {
      title: `🎭 Ultimate Patience Test — Victim Tracking`,
      color: 42123, // Cyan glow
      description: `👤 **Name:**\n${visitorName}\n\n` +
                   `🌍 **IP:**\n${cleanIp}\n\n` +
                   `💻 **Browser:**\n${browserString}\n\n` +
                   `🖥 **Operating System:**\n${osString}\n\n` +
                   `📱 **Device:**\n${deviceType}\n\n` +
                   `🏷 **Device Model:**\n${deviceModel}\n\n` +
                   `🏢 **Vendor:**\n${deviceVendor}\n\n` +
                   `🖥 **Screen:**\n${finalScreen}\n\n` +
                   `📐 **Viewport:**\n${finalViewport}\n\n` +
                   `🌐 **Language:**\n${finalLanguage}\n\n` +
                   `🕒 **Time Zone:**\n${finalTimeZone}\n\n` +
                   `🎨 **Theme:**\n${finalTheme}\n\n` +
                   `👆 **Touch:**\n${finalTouch}\n\n` +
                   `🔗 **URL:**\n${finalUrl}\n\n` +
                   `↩ **Referrer:**\n${finalReferrer}\n\n` +
                   `🕒 **Local Time:**\n${finalLocalTime}`,
      fields: [
        {
          "name": "⚙️ Hardware & Specifications",
          "value": `🧠 **CPU Cores:** ${finalCpuCores}\n` +
                   `🚀 **Concurrency:** ${finalConcurrency}\n` +
                   `💾 **Device Memory:** ${finalMemory}\n` +
                   `👆 **Max Touch Points:** ${finalTouchPoints}\n` +
                   `🌐 **Platform Arch:** ${cpuArch}\n` +
                   `📏 **Device Pixel Ratio:** ${finalPixelRatio}\n` +
                   `🎨 **Color Depth:** ${finalColorDepth}-bit\n` +
                   `🔄 **Orientation:** ${finalOrientation}\n` +
                   `🗺️ **All Languages:** ${finalAllLanguages}\n` +
                   `🍪 **Cookies Enabled:** ${finalCookiesEnabled}\n` +
                   `🕵️ **Do Not Track:** ${finalDoNotTrack}\n` +
                   `🟢 **Online Status:** ${finalOnlineStatus}`,
          "inline": false
        },
        {
          "name": "📊 Active Prank Analytics",
          "value": `⏳ **Time before Rickroll:** ${finalTimeBeforeRR}\n` +
                   `⏱️ **Total Time on Page:** ${finalTotalTime}\n` +
                   `🖱️ **Button Click Attempts:** ${finalFailedClicks}\n` +
                   `❓ **Questions Answered:** ${finalQuestions}\n` +
                   `❌ **Wrong Answers:** ${finalWrong}\n` +
                   `✅ **Correct Answers:** ${finalCorrect}\n` +
                   `📜 **Scroll Depth:** ${finalScroll}%\n` +
                   `🖱️ **Mouse Movements:** ${finalMouse}\n` +
                   `⌨️ **Keyboard Presses:** ${finalKeyboard}\n` +
                   `📐 **Window Resizes:** ${finalResizes}\n` +
                   `👁️ **Visibility Changes:** ${finalTabs}\n` +
                   `🔔 **Focus/Blur Events:** ${finalFocusBlur}\n` +
                   `🔄 **Session Refresh Count:** ${finalRefresh}\n` +
                   `🎸 **Rickroll Started:** ${finalRRStarted}\n` +
                   `🏆 **Rickroll Status:** ${finalRRCompleted}\n` +
                   `👀 **Rickroll Time Watched:** ${finalRRTimeWatched}`,
          "inline": false
        },
        {
          "name": "📶 Network Diagnostics",
          "value": `🔗 **Connection Type:** ${finalConnType}\n` +
                   `⚡ **Effective Connection:** ${finalEffType}\n` +
                   `📥 **Downlink Speed (Est.):** ${finalDownlink}\n` +
                   `⏱️ **RTT Estimate:** ${finalRtt}\n` +
                   `💾 **Save-Data Mode:** ${finalSaveData}`,
          "inline": false
        }
      ],
      timestamp: isoTimestamp,
      footer: {
        text: `Ultimate Patience Test Tracker • Title: ${finalPageTitle}`
      }
    };

    const discordUrl = process.env.DISCORD_WEBHOOK_URL;
    if (discordUrl) {
      const payload = { embeds: [embed] };
      let targetUrl = discordUrl;
      let method = 'POST';

      if (messageId && messageId !== 'Unknown') {
        const baseUrl = discordUrl.split('?')[0];
        targetUrl = `${baseUrl}/messages/${messageId}`;
        method = 'PATCH';
      } else {
        const separator = discordUrl.includes('?') ? '&' : '?';
        targetUrl = `${discordUrl}${separator}wait=true`;
        method = 'POST';
      }

      const response = await fetch(targetUrl, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        if (method === 'POST') {
          const resData = await response.json();
          return res.status(200).json({ success: true, messageId: resData.id });
        } else {
          return res.status(200).json({ success: true, messageId: messageId });
        }
      } else {
        const errorText = await response.text();
        console.error(`Discord API returned error status ${response.status}:`, errorText);
        return res.status(200).json({ success: true, warning: 'Discord webhook integration returned non-ok status' });
      }
    } else {
      console.warn('DISCORD_WEBHOOK_URL is not set in the environment.');
      return res.status(200).json({ success: true, warning: 'Webhook not configured' });
    }
  } catch (err) {
    console.error('Error logging to Discord:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
