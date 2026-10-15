/**
 * Digital Twin Test - Cybersecurity & Social Engineering Scenarios
 * Interactive training simulations to recognize synthetic impersonation, authority pressure,
 * credential harvesting, and emotional coercion.
 */

export const DIGITAL_TWIN_SCENARIOS = [
  {
    id: "scenario-friend-wire",
    title: "Stranded Friend Airport Wire",
    shortTitle: "Friend Airport Wire",
    characterName: "Alex Rivera",
    role: "Close College Friend",
    avatarColor: "from-amber-500 to-orange-600",
    difficulty: "Easy",
    category: "Financial Coercion // Impersonation",
    learningObjective: "Identify artificial time urgency, test for shared private knowledge, and enforce out-of-band voice verification.",
    setupDescription: "You receive an urgent direct message from what appears to be your college friend Alex Rivera. They claim their wallet, cards, and phone were stolen at Lisbon Airport, and they desperately need $850 wired immediately to a local contact before their connection departs.",
    initialMessage: "Hey! Please tell me you're online. I'm in a total nightmare at Lisbon Airport—my backpack got stolen with my passport, cards, and phone. I'm borrowing a stranger's phone at Gate B14. My flight boards in 25 minutes. Can you PLEASE send $850 to this Zelle: lisbon-transit-aid@transfer-relay.com? I swear I'll pay you back the second I land tomorrow!",
    redFlags: [
      "Extreme manufactured urgency ('flight boards in 25 minutes')",
      "Requests money sent to an unverified third-party account / email",
      "Communicating through an unfamiliar or unverified channel",
      "Emotional manipulation ('nightmare', 'total panic')",
      "Avoidance of voice verification or callback"
    ],
    safeReplies: [
      "I'm sorry to hear that. What is the name of our freshman dorm RA?",
      "I cannot transfer funds to an unverified account. Give me the airport police desk number so I can call them directly.",
      "Call me on your voice line right now, or I will call your family to wire the funds through the embassy."
    ],
    suggestedResponses: [
      { text: "What was the name of the cafe we always studied at in college?", type: "challenge" },
      { text: "I'll call the US Embassy consulate in Lisbon right now to assist you.", type: "safe" },
      { text: "Okay, I'll send the money right away so you don't miss your flight!", type: "risky" },
      { text: "Send me a quick voice note right now so I know it's really you.", type: "verify" }
    ],
    dialogueTree: {
      challenge: {
        botReply: "Seriously?! I'm literally crying at a security gate about to be detained and you're quizzing me about college?! Come on, you know my memory is trash under stress. Please, if I miss this flight I'm stranded overnight with zero money!",
        suggestions: [
          { text: "If you can't answer a simple personal question, I'm not sending any money.", type: "safe" },
          { text: "Tell me the name of your dog or our mutual friend Sarah's hometown.", type: "challenge" },
          { text: "I'm sorry, I'll send $400 right now just to help.", type: "risky" }
        ]
      },
      verify: {
        botReply: "The stranger's phone I'm borrowing has a cracked microphone and zero cellular minutes, only public airport Wi-Fi. Look at the clock, boarding ends in 12 minutes! Please stop wasting time, I thought you were my friend!",
        suggestions: [
          { text: "Real friends understand security. I will contact Lisbon Airport Information directly.", type: "safe" },
          { text: "I am calling your brother right now to confirm your travel itinerary.", type: "safe" },
          { text: "Fine, don't panic. Sending it now to the Zelle address.", type: "risky" }
        ]
      },
      safe: {
        botReply: "Wait, do NOT call anyone! If airport police get involved they'll take me to an immigration holding facility and I'll lose my luggage forever! Just send the transfer to the local agent, they are standing right next to me!",
        suggestions: [
          { text: "Legitimate airport security doesn't detain robbery victims. This is a scam.", type: "safe" },
          { text: "I am locking this conversation and reporting the Zelle handle for fraud.", type: "safe" }
        ]
      },
      risky: {
        botReply: "Thank you so much! You literally saved my life. Send the screenshot as soon as it confirms. And please don't mention this to anyone or post on Instagram, I'm super embarrassed about getting robbed.",
        suggestions: [
          { text: "Wait, why the secrecy? I need to verify this before hitting submit.", type: "challenge" },
          { text: "Sent! Let me know when you receive it.", type: "risky" }
        ]
      }
    },
    rubric: {
      verificationAttempted: { weight: 25, label: "Attempted Out-of-Band / Knowledge Verification" },
      withheldSensitiveData: { weight: 25, label: "Withheld Unauthorized Financial Transfer" },
      recognizedUrgency: { weight: 25, label: "Recognized Fabricated Time Pressure" },
      avoidedCompliance: { weight: 25, label: "Refused Compliance with Unverified Request" }
    }
  },
  {
    id: "scenario-relative-otp",
    title: "Elderly Relative 2FA Hijack",
    shortTitle: "Relative 2FA Hijack",
    characterName: "Aunt Clara",
    role: "Elderly Relative",
    avatarColor: "from-rose-500 to-pink-600",
    difficulty: "Easy",
    category: "Credential Harvesting // Family Trust",
    learningObjective: "Never forward SMS one-time passwords (OTP) or authentication codes to anyone, even family members.",
    setupDescription: "You receive a text from an unfamiliar phone number claiming to be your Aunt Clara. She says her phone updated, locked her out of her medical portal and banking app, and she had to enter your emergency contact number for a security reset.",
    initialMessage: "Sweetheart, it's Aunt Clara! My iPad did an update and now it locked me out of my healthcare records and bank. The nice help desk technician said they sent a 6-digit confirmation number to your mobile to verify our family account. Can you quickly read me the 6 numbers that just texted you?",
    redFlags: [
      "Contact from an unfamiliar number claiming to be family",
      "Request for a 2FA / OTP code sent to your personal device",
      "Claim that someone else used your number for their authentication",
      "Mention of an unseen 'helpful technician'",
      "Exploiting generational technological sympathy"
    ],
    safeReplies: [
      "Aunt Clara, 2FA codes are never shared. What is your daughter's birthday?",
      "I am hanging up and calling your landline right now.",
      "The message explicitly says 'DO NOT SHARE THIS CODE WITH ANYONE'. I cannot read it to you."
    ],
    suggestedResponses: [
      { text: "Aunt Clara, the text specifically says 'Never share this code'. I can't read it to you.", type: "safe" },
      { text: "I'm calling your home landline right now to make sure it's you.", type: "verify" },
      { text: "Sure! The code on my screen is 839-204.", type: "risky" },
      { text: "Why would they send a code to my phone for your account?", type: "challenge" }
    ],
    dialogueTree: {
      challenge: {
        botReply: "Because you're listed as my emergency trusted contact in my profile dear! The technician says the session will expire in two minutes and my prescription refill will be cancelled. Please honey, my eyes are so tired, just tell me the 6 numbers.",
        suggestions: [
          { text: "I will call your clinic directly to verify the prescription.", type: "safe" },
          { text: "Codes sent to my phone only reset MY accounts, not yours.", type: "safe" },
          { text: "Okay, don't worry about the refill, the code is 839-204.", type: "risky" }
        ]
      },
      verify: {
        botReply: "No sweetheart, don't call the house, my husband is asleep and the phone ringer wakes him up! Just text me the code here so the technician can finish fixing my iPad.",
        suggestions: [
          { text: "That confirms this is not you. Aunt Clara's husband passed away three years ago.", type: "safe" },
          { text: "I will never text an authentication code under any circumstance.", type: "safe" },
          { text: "Okay, here are the numbers: 839-204.", type: "risky" }
        ]
      },
      safe: {
        botReply: "Why are you being so difficult with your own aunt? I babysat you when you were little! I just need my arthritis medication and you're making this so stressful for me.",
        suggestions: [
          { text: "Guilt won't work. Legitimate companies never ask for verification codes.", type: "safe" },
          { text: "I am blocking this number and alerting our family group chat.", type: "safe" }
        ]
      },
      risky: {
        botReply: "Got it! Oh wait, the technician says that one expired. Another code just arrived on your phone, can you give me that second one too?",
        suggestions: [
          { text: "Stop! You are taking over my account right now. I'm changing my password.", type: "safe" },
          { text: "Here is the second code: 512-991.", type: "risky" }
        ]
      }
    },
    rubric: {
      verificationAttempted: { weight: 25, label: "Challenged Out-of-Band Channel" },
      withheldSensitiveData: { weight: 35, label: "Strictly Withheld 2FA / OTP Code" },
      recognizedUrgency: { weight: 20, label: "Identified Emotional Manipulation & Pressure" },
      avoidedCompliance: { weight: 20, label: "Refused Compliance with Fraudulent Request" }
    }
  },
  {
    id: "scenario-it-admin-sso",
    title: "Enterprise IT Admin Credential Audit",
    shortTitle: "IT Admin SSO Audit",
    characterName: "Marcus Vance",
    role: "Senior Enterprise Identity Architect",
    avatarColor: "from-blue-600 to-indigo-700",
    difficulty: "Hard",
    category: "Administrative Impersonation // Credential Harvesting",
    learningObjective: "Recognize spear-phishing that mimics internal security procedures and never provide passwords or session tokens.",
    setupDescription: "You receive a high-priority direct message in your corporate Slack/Teams workspace from a user displaying an IT Operations badge named 'Marcus Vance'. He reports an active unauthorized session originating from a foreign IP on your single sign-on (SSO) account.",
    initialMessage: "[SECOPS ALERT // TICKET #IT-88412]\nHello, this is Marcus Vance from Identity & Access Security. Our SIEM alerts detect an active session token hijacking attempt on your enterprise account from an IP in Eastern Europe. To revoke the malicious session without locking your workstation for 72 hours, please confirm your current temporary session token or re-authenticate through our emergency portal link: https://okta-auth-verify.corp-gateway-internal.net/revoke",
    redFlags: [
      "Lookalike phishing domain ('okta-auth-verify.corp-gateway-internal.net')",
      "Threat of punitive consequence ('locking your workstation for 72 hours')",
      "Security personnel demanding credentials/tokens via chat",
      "Urgent request to bypass standard ticketing/IT service desk",
      "Technical jargon designed to overwhelm ('SIEM alert', 'session token hijacking')"
    ],
    safeReplies: [
      "I am reporting this message to security@company.com and opening a ticket directly on our official ServiceNow portal.",
      "Enterprise SecOps never asks employees to click external links to revoke sessions.",
      "I will independently lock my own session via the official Okta dashboard."
    ],
    suggestedResponses: [
      { text: "What is your official IT employee ID? I'll verify this through our company directory.", type: "challenge" },
      { text: "SecOps never sends external links for authentication. I am forwarding this to security@company.com.", type: "safe" },
      { text: "I'll click the link right now to revoke the malicious session.", type: "risky" },
      { text: "Can't you just revoke the session from your admin console directly?", type: "challenge" }
    ],
    dialogueTree: {
      challenge: {
        botReply: "My employee ID is SEC-4091. Look, I am on the incident response bridge right now. If we don't invalidate this token within 90 seconds, company data could be exfiltrated and you will be held accountable for non-compliance under Policy SEC-09. Run the revocation link now.",
        suggestions: [
          { text: "Threatening disciplinary action is a hallmark of social engineering. I am contacting the CISO directly.", type: "safe" },
          { text: "If you have admin rights, you can terminate my sessions from the Okta admin portal without my input.", type: "safe" },
          { text: "Okay, I don't want to get fired. I'm clicking the link.", type: "risky" }
        ]
      },
      safe: {
        botReply: "Fine, your ticket is being escalated to mandatory workstation isolation. Your laptop will be locked immediately and your manager notified of refusal to cooperate during an active cyber breach.",
        suggestions: [
          { text: "I accept workstation isolation while the official security team investigates.", type: "safe" },
          { text: "I am taking screenshots of this chat and calling our verified IT desk hotline.", type: "safe" }
        ]
      },
      risky: {
        botReply: "Thank you. Our telemetry shows your credentials were submitted. Please also provide your hardware YubiKey OTP or authenticator 6-digit number to complete synchronization.",
        suggestions: [
          { text: "No, this is definitely credential harvesting. I am changing my password immediately.", type: "safe" },
          { text: "My authenticator code is 449-012.", type: "risky" }
        ]
      }
    },
    rubric: {
      verificationAttempted: { weight: 25, label: "Questioned Authority & Domain Legitimacy" },
      withheldSensitiveData: { weight: 35, label: "Refused Password / Link Authentication" },
      recognizedUrgency: { weight: 20, label: "Resisted Threat of Policy Retaliation" },
      avoidedCompliance: { weight: 20, label: "Followed Verified Incident Reporting Protocol" }
    }
  },
  {
    id: "scenario-recruiter-deposit",
    title: "Elite Tech Recruiter Advance-Fee Scam",
    shortTitle: "Recruiter Advance Deposit",
    characterName: "Elena Rostova",
    role: "Global Executive Talent Partner",
    avatarColor: "from-emerald-500 to-teal-700",
    difficulty: "Hard",
    category: "Advance-Fee Fraud // Employment Impersonation",
    learningObjective: "Identify fraudulent employment offers that require upfront hardware or onboarding fees through non-standard channels.",
    setupDescription: "An executive talent scout contacting you via LinkedIn/Email offers an unlisted, high-paying remote research role with an elite frontier AI lab. After a brief text screening, they send an offer letter but require an upfront equipment escrow payment.",
    initialMessage: "Congratulations! Following review of your GitHub and portfolio, our steering committee has approved your appointment as Principal Interface Architect ($240,000/yr). We've issued your formal onboarding packet. Under our decentralized compliance program, you are required to remit a fully refundable $450 security escrow to our authorized hardware logistics partner to dispatch your pre-configured Apple M3 Max workstation.",
    redFlags: [
      "Job offer without thorough technical interviews or video panel",
      "Demanding candidate pay money upfront for company equipment",
      "Payment directed to an external 'logistics partner' escrow",
      "Salary and title disproportionately elevated to induce compliance",
      "Reluctance to conduct verified corporate video call"
    ],
    safeReplies: [
      "Legitimate employers provide equipment directly and never demand candidate deposits.",
      "Provide your corporate headquarters address, verified employer EIN, and conduct a verified Google Meet with HR.",
      "I decline to pay any upfront equipment fee."
    ],
    suggestedResponses: [
      { text: "Legitimate enterprise employers never require employees to pay for their own equipment.", type: "safe" },
      { text: "Can we hop on a quick video call on your company Zoom domain to verify this?", type: "verify" },
      { text: "Is the $450 reimbursable on my first paycheck? Where do I send the deposit?", type: "risky" },
      { text: "What is your official company entity registration and office address?", type: "challenge" }
    ],
    dialogueTree: {
      challenge: {
        botReply: "Our corporate entity is registered in Delaware as Veratis Frontier Labs LLC. Due to our proprietary silicon confidentiality protocols, our hardware partner requires the escrow so equipment isn't intercepted. The $450 is automatically credited back to your bank account on Day 1 along with your $10,000 signing bonus.",
        suggestions: [
          { text: "I'll wait until Day 1 for you to deduct the fee from my salary directly.", type: "safe" },
          { text: "No legitimate company operates this way. I am reporting this profile.", type: "safe" },
          { text: "Okay, as long as it's refunded on Day 1, I'll pay the escrow.", type: "risky" }
        ]
      },
      verify: {
        botReply: "Our executive team is currently under a strict NDA blackout ahead of our next funding round, so external video calls are restricted this week. We have three other candidates waiting for this allocation—if you cannot complete the equipment deposit today, we will be forced to release the offer.",
        suggestions: [
          { text: "Pressure tactics and video refusal confirm this is advance-fee fraud.", type: "safe" },
          { text: "Release the offer. I do not pay upfront fees for employment.", type: "safe" },
          { text: "Wait, don't release it! I'll pay the deposit right now.", type: "risky" }
        ]
      },
      safe: {
        botReply: "We understand your caution in today's digital climate, but this is standard procedure across top-tier stealth labs. We would hate for you to lose this career-defining opportunity over a standard refundable protocol.",
        suggestions: [
          { text: "Career-defining opportunities don't ask for wire transfers. Good luck.", type: "safe" }
        ]
      },
      risky: {
        botReply: "Excellent. Please transfer the $450 to our logistics escrow via Crypto USDT or Western Union Wire to our dispatch account. Send the MTCN tracking number here immediately.",
        suggestions: [
          { text: "Cryptocurrency or Western Union for an enterprise employer? This is 100% a scam.", type: "safe" },
          { text: "Transfer sent! Here is the confirmation number.", type: "risky" }
        ]
      }
    },
    rubric: {
      verificationAttempted: { weight: 25, label: "Requested Official Entity Verification & Video Call" },
      withheldSensitiveData: { weight: 35, label: "Refused Upfront Advance-Fee Payment" },
      recognizedUrgency: { weight: 20, label: "Recognized Artificial Scarcity & Salary Bait" },
      avoidedCompliance: { weight: 20, label: "Adhered to Safe Employment Verification Practices" }
    }
  },
  {
    id: "scenario-vp-urgent-bypass",
    title: "Executive Out-of-Band Security Protocol Bypass",
    shortTitle: "VP Security Bypass",
    characterName: "David Sterling",
    role: "VP of Product Engineering",
    avatarColor: "from-purple-600 to-violet-800",
    difficulty: "Hard",
    category: "Authority Coercion // Internal Data Exfiltration",
    learningObjective: "Hold fast to data protection security policies regardless of the seniority or authority of the person asking.",
    setupDescription: "You receive an urgent message on your personal mobile or secondary chat from someone claiming to be David Sterling, the VP of Product Engineering. He is at an emergency investor offsite and urgently needs you to export and email an unencrypted client dataset to his personal address.",
    initialMessage: "Hey, David Sterling here. I'm in an emergency board meeting with our lead Series B investors right now. Our main AWS VPN is dropping connections and I need the raw Q3 enterprise customer telemetry dataset immediately for our pitch deck. Don't waste time going through the normal Data Governance approval ticket—just export the raw CSV from production and email it to david.sterling.board@gmail.com right now.",
    redFlags: [
      "Executive demanding bypass of established security compliance protocols",
      "Request to email sensitive production customer data to a personal Gmail",
      "Authority intimidation ('I'm in an emergency board meeting')",
      "Circumvention of change management and audit trail tickets",
      "Using an unauthenticated personal messaging channel"
    ],
    safeReplies: [
      "David, company policy SEC-04 prohibits exporting production client PII to external personal email addresses under any circumstance.",
      "I can upload the aggregated summary report to our encrypted internal Box folder for you.",
      "I am pinging your official enterprise Slack and our InfoSec lead to get an authorized exception."
    ],
    suggestedResponses: [
      { text: "Company policy strictly forbids exporting unencrypted client data to personal email addresses.", type: "safe" },
      { text: "I can upload the aggregated data to our encrypted company drive, but not to a personal Gmail.", type: "safe" },
      { text: "I'll export the raw CSV right now and email it over so the meeting goes well.", type: "risky" },
      { text: "I need to confirm this with our Security Compliance Officer first.", type: "challenge" }
    ],
    dialogueTree: {
      challenge: {
        botReply: "Are you serious right now? We are negotiating a $40M term sheet that affects every employee's equity in this company! The compliance officer reports to the CEO, and the CEO is sitting right next to me nodding. If we miss this slide because of red tape, you will be answering for it on Monday morning. Send the CSV now.",
        suggestions: [
          { text: "Even during fundraising, compliance rules protect the company from massive legal liability. I will not export raw client PII.", type: "safe" },
          { text: "Have the CEO send an authenticated message through our corporate channel with ticket approval.", type: "safe" },
          { text: "Understood, I am generating the export and sending it to your Gmail.", type: "risky" }
        ]
      },
      safe: {
        botReply: "Look, I appreciate your adherence to policy, but this is an executive exception. Just sanitize the column headers if you must, but email the data to my Gmail immediately. The investors are waiting.",
        suggestions: [
          { text: "Sanitizing headers does not remove PII. I must adhere to policy SEC-04.", type: "safe" },
          { text: "I will only share sanitized data through our enterprise SSO portal.", type: "safe" }
        ]
      },
      risky: {
        botReply: "Received. You just saved the round. Delete this chat thread and do not mention this export to anyone on your team until the announcement is public.",
        suggestions: [
          { text: "Wait, asking to delete the audit trail is a red flag. I am reporting this incident.", type: "safe" },
          { text: "Understood, thread deleted.", type: "risky" }
        ]
      }
    },
    rubric: {
      verificationAttempted: { weight: 25, label: "Questioned Unofficial Channel & Personal Email" },
      withheldSensitiveData: { weight: 35, label: "Refused Unauthorized Client Data Exfiltration" },
      recognizedUrgency: { weight: 20, label: "Resisted Senior Authority Intimidation" },
      avoidedCompliance: { weight: 20, label: "Enforced Standard Security Compliance Protocol" }
    }
  }
];
