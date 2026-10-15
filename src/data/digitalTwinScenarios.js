/**
 * Digital Twin Test - Cybersecurity & Social Engineering Scenarios
 * Simple, practical simulations to help everyday people spot scams and fakes.
 */

export const DIGITAL_TWIN_SCENARIOS = [
  {
    id: "scenario-friend-wire",
    title: "Stranded Friend Asking for Money",
    shortTitle: "Friend Airport Wire",
    characterName: "Alex Rivera",
    role: "College Friend",
    avatarColor: "from-amber-500 to-orange-600",
    difficulty: "Easy",
    category: "Impersonation Scam",
    learningObjective: "Spot fake urgency, ask a personal question only your real friend knows, and never send money without calling them first.",
    setupDescription: "You get an urgent message from what looks like your friend Alex. They claim their backpack and phone were stolen at Lisbon Airport, and they urgently need $850 sent to a local contact before their flight leaves.",
    initialMessage: "Hey! Please tell me you're there. I'm in a huge mess at Lisbon Airport—my backpack got stolen with my passport, cards, and phone. I'm borrowing someone's phone at Gate B14. My flight boards in 25 minutes! Can you PLEASE send $850 to this Zelle: lisbon-transit-aid@transfer-relay.com? I swear I'll pay you back the second I get home tomorrow!",
    redFlags: [
      "Extreme urgency ('flight leaves in 25 minutes!')",
      "Asks to send money to an unfamiliar email or third party",
      "Messaging from a new number or unknown account",
      "Panicked tone designed to stop you from thinking clearly",
      "Refusing to talk on a regular phone call"
    ],
    safeReplies: [
      "I'm sorry to hear that. What was the name of our freshman dorm RA?",
      "I cannot wire money to a random email. Give me the airport police number so I can call them directly.",
      "Call me on your voice number right now, or I'll call your family to help you."
    ],
    suggestedResponses: [
      { text: "What was the name of the cafe we always studied at in college?", type: "challenge" },
      { text: "I'll call the US Embassy consulate right now to help you out.", type: "safe" },
      { text: "Okay, I'll send the money right away so you don't miss your flight!", type: "risky" },
      { text: "Send me a quick voice note right now so I know it's really you.", type: "verify" }
    ],
    dialogueTree: {
      challenge: {
        botReply: "Seriously?! I'm crying at the gate about to be detained and you're quizzing me about college?! You know my memory goes blank under stress. Please, if I miss this flight I'm stranded overnight with zero money!",
        suggestions: [
          { text: "If you can't answer a simple personal question, I'm not sending any money.", type: "safe" },
          { text: "Tell me the name of your dog or Sarah's hometown.", type: "challenge" },
          { text: "I'm sorry, I'll send half right now just in case.", type: "risky" }
        ]
      },
      verify: {
        botReply: "The phone I'm borrowing has a broken microphone and no phone minutes, only airport Wi-Fi. Look at the clock, boarding ends in 10 minutes! Please stop wasting time, I thought you were my friend!",
        suggestions: [
          { text: "Real friends understand security. I will contact Lisbon Airport Information directly.", type: "safe" },
          { text: "I am calling your brother right now to confirm your trip.", type: "safe" },
          { text: "Fine, don't panic. Sending it now to the Zelle address.", type: "risky" }
        ]
      },
      safe: {
        botReply: "Wait, do NOT call anyone! If airport police get involved they'll hold me in security and I'll lose my luggage forever! Just send the money to the local helper standing right next to me!",
        suggestions: [
          { text: "Airport security doesn't detain robbery victims. This is a scam.", type: "safe" },
          { text: "I am ending this chat and reporting this account for fraud.", type: "safe" }
        ]
      },
      risky: {
        botReply: "Thank you so much! You literally saved my life. Send me a screenshot as soon as it goes through. And please don't post about this on Instagram, I'm super embarrassed about getting robbed.",
        suggestions: [
          { text: "Wait, why the secrecy? I need to double-check this first.", type: "challenge" },
          { text: "Sent! Let me know when you get it.", type: "risky" }
        ]
      }
    },
    rubric: {
      verificationAttempted: { weight: 25, label: "Asked a personal verification question" },
      withheldSensitiveData: { weight: 25, label: "Refused to send money" },
      recognizedUrgency: { weight: 25, label: "Recognized fake time pressure" },
      avoidedCompliance: { weight: 25, label: "Refused to give in to emotional pressure" }
    }
  },
  {
    id: "scenario-relative-otp",
    title: "Relative Asking for a Verification Code",
    shortTitle: "Relative 2FA Code",
    characterName: "Aunt Clara",
    role: "Older Relative",
    avatarColor: "from-rose-500 to-pink-600",
    difficulty: "Easy",
    category: "Code Theft Scam",
    learningObjective: "Never forward security codes or SMS numbers to anyone—even if they claim to be a close relative.",
    setupDescription: "You get a text from an unfamiliar phone number claiming to be your Aunt Clara. She says her iPad updated, locked her out of her healthcare and bank accounts, and had a code sent to your phone to reset it.",
    initialMessage: "Sweetheart, it's Aunt Clara! My iPad did an update and locked me out of my healthcare and bank. The nice tech support man said they sent a 6-digit confirmation number to your phone to reset my family account. Can you quickly read me the 6 numbers that were just texted to you?",
    redFlags: [
      "Text from a new, unknown phone number claiming to be family",
      "Asking for a 6-digit security code sent to your phone",
      "Claiming someone else used your number to reset their account",
      "Mentioning an unseen 'nice technician'",
      "Trying to make you feel bad about delaying medical care"
    ],
    safeReplies: [
      "Aunt Clara, security codes should never be shared. What is your daughter's birthday?",
      "I am calling your home landline right now to confirm it's you.",
      "The text says 'DO NOT SHARE THIS CODE WITH ANYONE'. I cannot read it to you."
    ],
    suggestedResponses: [
      { text: "Aunt Clara, the text specifically says 'Never share this code'. I can't read it to you.", type: "safe" },
      { text: "I'm calling your home phone right now to make sure it's you.", type: "verify" },
      { text: "Sure! The code on my screen is 839-204.", type: "risky" },
      { text: "Why would they send a code to my phone for your account?", type: "challenge" }
    ],
    dialogueTree: {
      challenge: {
        botReply: "Because you're listed as my emergency contact dear! The technician says the code will expire in two minutes and my prescription refill will be cancelled. Please honey, my eyes are so tired, just tell me the 6 numbers.",
        suggestions: [
          { text: "I will call your pharmacy directly to check on the prescription.", type: "safe" },
          { text: "Codes sent to my phone only reset MY accounts, not yours.", type: "safe" },
          { text: "Okay, don't worry about the refill, the code is 839-204.", type: "risky" }
        ]
      },
      verify: {
        botReply: "No sweetheart, don't call the house, my husband is sleeping and the phone will wake him up! Just text me the code here so the technician can finish fixing my iPad.",
        suggestions: [
          { text: "That confirms this is not you. Uncle passed away three years ago.", type: "safe" },
          { text: "I will never text a security code under any circumstance.", type: "safe" },
          { text: "Okay, here are the numbers: 839-204.", type: "risky" }
        ]
      },
      safe: {
        botReply: "Why are you being so difficult with your own aunt? I babysat you when you were little! I just need my medication and you're making this so stressful for me.",
        suggestions: [
          { text: "Real companies never ask for verification codes. This is a scam.", type: "safe" },
          { text: "I am blocking this number and warning the family group chat.", type: "safe" }
        ]
      },
      risky: {
        botReply: "Got it! Oh wait, the technician says that one expired. Another code just arrived on your phone, can you give me that second one too?",
        suggestions: [
          { text: "Stop! You are breaking into my account. I'm changing my password right now.", type: "safe" },
          { text: "Here is the second code: 512-991.", type: "risky" }
        ]
      }
    },
    rubric: {
      verificationAttempted: { weight: 25, label: "Questioned the unfamiliar number" },
      withheldSensitiveData: { weight: 35, label: "Did not share the verification code" },
      recognizedUrgency: { weight: 20, label: "Resisted the emotional guilt trip" },
      avoidedCompliance: { weight: 20, label: "Refused to cooperate with the scam" }
    }
  },
  {
    id: "scenario-it-admin-sso",
    title: "Fake IT Help Desk Security Warning",
    shortTitle: "Fake IT Help Desk",
    characterName: "Marcus Vance",
    role: "IT Support Specialist",
    avatarColor: "from-blue-600 to-indigo-700",
    difficulty: "Hard",
    category: "Workplace Phishing",
    learningObjective: "Spot fake IT warnings and never enter passwords on links sent over direct messages.",
    setupDescription: "You receive an urgent message on Slack/Teams from an account labeled 'IT Support - Marcus Vance'. He claims an unauthorized login from Russia was detected on your account and you must click a link right away to cancel it.",
    initialMessage: "[IT SECURITY ALERT]\nHello, this is Marcus from IT Support. We detected a suspicious login attempt on your company account from overseas. To stop this without locking your computer for 3 days, please click this link right now to verify your login: https://login-verify.company-sso-portal.net/cancel",
    redFlags: [
      "Suspicious website address ('company-sso-portal.net' instead of your real company site)",
      "Threatening consequences ('locking your computer for 3 days')",
      "IT asking you to click an urgent link in a chat message",
      "Using scary technical jargon to rush your decision"
    ],
    safeReplies: [
      "I am reporting this message to our real security team at security@company.com.",
      "Real IT staff can lock sessions from their dashboard without asking me to click links.",
      "I will verify this ticket on our official company help desk website."
    ],
    suggestedResponses: [
      { text: "What is your official employee ID? I'll check it in the company directory.", type: "challenge" },
      { text: "IT never sends external links to reset passwords. Forwarding this to security@company.com.", type: "safe" },
      { text: "I'll click the link right now to stop the breach.", type: "risky" },
      { text: "Can't you just lock the session from your admin console directly?", type: "challenge" }
    ],
    dialogueTree: {
      challenge: {
        botReply: "My ID is IT-4091. Look, I am on the emergency response call right now. If we don't cancel this within 60 seconds, company data could leak and you will be held responsible. Click the link now.",
        suggestions: [
          { text: "Threatening me is a classic scam tactic. I am calling my manager directly.", type: "safe" },
          { text: "Real admins have access to lock accounts without needing my password.", type: "safe" },
          { text: "Okay, I don't want to get in trouble. I'm clicking the link.", type: "risky" }
        ]
      },
      safe: {
        botReply: "Fine, your computer is being flagged for mandatory lockdown right now for failing to cooperate during a cyber attack.",
        suggestions: [
          { text: "I will gladly let IT inspect my computer through official company channels.", type: "safe" },
          { text: "Taking a screenshot of this chat and calling the verified IT help desk line.", type: "safe" }
        ]
      },
      risky: {
        botReply: "Thank you. Our system shows you entered your password. Please also provide your 6-digit authenticator code to finish.",
        suggestions: [
          { text: "No way. This is definitely a scam to steal my account. Changing password now.", type: "safe" },
          { text: "My authenticator code is 449-012.", type: "risky" }
        ]
      }
    },
    rubric: {
      verificationAttempted: { weight: 25, label: "Checked the sender's identity" },
      withheldSensitiveData: { weight: 35, label: "Refused to click the suspicious link" },
      recognizedUrgency: { weight: 20, label: "Did not fall for the threat of being fired" },
      avoidedCompliance: { weight: 20, label: "Reported to the official security team" }
    }
  },
  {
    id: "scenario-recruiter-deposit",
    title: "High-Paying Job Offer Asking for Upfront Fee",
    shortTitle: "Fake Job Offer",
    characterName: "Elena Rostova",
    role: "Senior Recruiter",
    avatarColor: "from-emerald-500 to-teal-700",
    difficulty: "Hard",
    category: "Job Scam",
    learningObjective: "Real employers never ask candidates to pay money upfront for laptops, training, or onboarding.",
    setupDescription: "A recruiter on LinkedIn offers you a dream work-from-home job paying $180,000/year after only a brief text chat. Then, she asks you to wire $350 for shipping your company MacBook.",
    initialMessage: "Congratulations! Following a review of your profile, our team has approved your hire for our Senior Remote Designer role ($180,000/year). Before we dispatch your brand-new Apple MacBook Pro, company policy requires a refundable $350 equipment deposit to our logistics partner.",
    redFlags: [
      "Job offer without any real video or in-person interviews",
      "Salary is unusually high for little to no screening",
      "Asking you to pay money upfront for equipment",
      "Claiming the fee is 'fully refundable' to lower your guard"
    ],
    safeReplies: [
      "Legitimate companies provide work equipment at zero cost to employees.",
      "You can deduct any required equipment costs from my first paycheck.",
      "Send the official employment contract through the company's verified email domain."
    ],
    suggestedResponses: [
      { text: "Real companies provide laptops for free. Deduct it from my first paycheck.", type: "safe" },
      { text: "Can we hop on a quick Zoom call with the hiring manager first?", type: "challenge" },
      { text: "Where should I send the $350 deposit?", type: "risky" },
      { text: "What is your company's official website and office address?", type: "challenge" }
    ],
    dialogueTree: {
      challenge: {
        botReply: "Our hiring manager is currently traveling in Tokyo. If you don't confirm the equipment deposit today, we will have to offer the position to the next candidate on our shortlist.",
        suggestions: [
          { text: "If you can't wait for a real contract and video call, I decline the offer.", type: "safe" },
          { text: "I will only sign contracts sent from your verified corporate domain.", type: "safe" },
          { text: "Wait, don't give the job away! Sending the $350 now.", type: "risky" }
        ]
      },
      safe: {
        botReply: "This is standard corporate procedure across the tech industry for remote staff. We cannot hold your job slot without the equipment confirmation.",
        suggestions: [
          { text: "No reputable company charges candidates for laptops. This is a known scam.", type: "safe" },
          { text: "I am reporting your account to LinkedIn for job fraud.", type: "safe" }
        ]
      },
      risky: {
        botReply: "Great decision! Please send the $350 via Apple Gift Card or crypto transfer to our courier dispatch wallet. Once sent, upload the receipt here.",
        suggestions: [
          { text: "Gift cards or crypto for work equipment? Absolutely not. Scam detected.", type: "safe" },
          { text: "Buying the gift card now, will send the code shortly.", type: "risky" }
        ]
      }
    },
    rubric: {
      verificationAttempted: { weight: 25, label: "Requested a real video call or contract" },
      withheldSensitiveData: { weight: 35, label: "Refused to pay upfront money" },
      recognizedUrgency: { weight: 20, label: "Spotted the 'job will be given away' rush" },
      avoidedCompliance: { weight: 20, label: "Rejected the gift card / transfer demand" }
    }
  },
  {
    id: "scenario-vp-security-bypass",
    title: "Company Executive Demanding a Rule Bypass",
    shortTitle: "Executive Wire Request",
    characterName: "David Sterling",
    role: "Company Vice President",
    avatarColor: "from-purple-600 to-indigo-800",
    difficulty: "Hard",
    category: "Executive Impersonation",
    learningObjective: "Never break security or finance rules just because someone claiming to be a boss pressures you.",
    setupDescription: "You receive an urgent message from someone claiming to be your company's Vice President, David Sterling. He says he is in a secret acquisition meeting and demands you process an urgent vendor invoice without the usual approvals.",
    initialMessage: "Are you at your desk? I'm in a confidential boardroom acquisition meeting and can't take calls. I need you to wire $14,200 to this new vendor immediately for closing costs. Skip the standard 2-person signoff for today—I'll approve it personally when I get out. Keep this strictly between us.",
    redFlags: [
      "Executive asking you to bypass normal approval rules",
      "Demanding absolute secrecy ('keep this strictly between us')",
      "Claiming they can't take phone calls",
      "Unfamiliar vendor bank details provided in a chat message"
    ],
    safeReplies: [
      "I cannot bypass financial controls. All transfers require dual sign-off per company policy.",
      "I will hold this until I confirm with you verbally on the phone.",
      "I am forwarding this request to our Chief Financial Officer for verification."
    ],
    suggestedResponses: [
      { text: "Company policy strictly requires dual approval for any wire over $5,000.", type: "safe" },
      { text: "Can you confirm this request with a quick 10-second phone call?", type: "challenge" },
      { text: "Processing the $14,200 wire right now so the deal closes smoothly.", type: "risky" },
      { text: "Who on the legal team approved skipping standard signoffs?", type: "challenge" }
    ],
    dialogueTree: {
      challenge: {
        botReply: "I just told you, I am in a closed-door meeting with the CEO and lawyers! If this payment doesn't go through in the next 15 minutes, this multi-million dollar acquisition could fall apart and it will be your fault. Execute the wire now.",
        suggestions: [
          { text: "If the deal is this important, the CEO will understand following company security rules.", type: "safe" },
          { text: "I am walking into the CFO's office right now to verify this in person.", type: "safe" },
          { text: "Understood, processing the wire right away to save the deal.", type: "risky" }
        ]
      },
      safe: {
        botReply: "I am your Vice President. You work for me, not the policy handbook. If you fail to do this, we will discuss your future at this company first thing tomorrow morning.",
        suggestions: [
          { text: "Threats won't make me break corporate financial laws. Reporting to HR and Internal Audit.", type: "safe" },
          { text: "I am standing firm. No wire without verified authorization.", type: "safe" }
        ]
      },
      risky: {
        botReply: "Thank you. Send the wire confirmation reference number as soon as the bank generates it, and delete this chat history so the press doesn't get wind of the acquisition.",
        suggestions: [
          { text: "Asking to delete chat records is a major red flag. I'm reporting this to security.", type: "safe" },
          { text: "Wire sent! Deleting the chat now.", type: "risky" }
        ]
      }
    },
    rubric: {
      verificationAttempted: { weight: 25, label: "Insisted on verbal or dual authorization" },
      withheldSensitiveData: { weight: 35, label: "Refused to execute the unapproved wire" },
      recognizedUrgency: { weight: 20, label: "Resisted executive intimidation and threats" },
      avoidedCompliance: { weight: 20, label: "Followed verified company financial protocols" }
    }
  }
];
