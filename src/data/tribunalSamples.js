/**
 * Sample Investigation Claims for Truth Tribunal
 * Simple, clear, plain-English investigations of viral claims and fakes.
 */
export const TRIBUNAL_SAMPLES = [
  {
    id: "sample-geneva-peace",
    title: "Leaked Video: Diplomat Cancels Peace Treaty",
    category: "Diplomatic Video",
    claim: "A viral video claims European Ambassador Vance announced his country is quitting the security treaty during a press meeting in Geneva.",
    evidenceProvided: "A 48-second video clip posted on an anonymous Telegram channel showing Ambassador Vance speaking at a podium with UN logos and reporters in the background.",
    knownContext: "Official flight records show Ambassador Vance was flying to Zurich at that exact time. The suit pin he is wearing was retired in 2024. The real treaty text has no rule matching what he says.",
    skepticAnalysis: {
      unsupportedAssumptions: [
        "Assumes the person in the video is really Ambassador Vance, not a computer face-swap.",
        "Assumes this happened recently, rather than being recycled old footage from 2023.",
        "Assumes an ambassador has the legal authority to cancel a treaty by himself."
      ],
      missingEvidence: [
        "No real news reporters or TV channels at the UN reported this.",
        "No official government statement or UN document exists."
      ],
      alternativeExplanations: [
        "Someone used AI face-swapping over old footage to cause panic in the financial markets.",
        "An actor wearing makeup made to look like the ambassador."
      ],
      contradictions: [
        "Air traffic logs prove Ambassador Vance was on an airplane flying to Zurich when this was recorded.",
        "The suit pin in the video hasn't been worn in over two years."
      ],
      substantiationRequirements: [
        "Original raw camera file with verified date and GPS metadata.",
        "Official confirmation from the Swiss Department of Foreign Affairs."
      ]
    },
    forensicAnalysis: {
      textCharacteristics: "The speech sounds like robotic translation, not how real diplomats speak.",
      sourceObservations: "Posted from an anonymous Telegram account created 2 days ago. All camera and location data was erased.",
      visualClues: "Blurry seam along the jawline where the face was pasted on. The lighting on the face does not match the room.",
      audioClues: "The voice cuts off unnaturally and has no room echo, typical of cloned AI voices.",
      groundedObservations: [
        "The file has no camera data and was heavily compressed.",
        "The podium logo matches the 2023 press room, not the newly renovated 2026 room."
      ]
    },
    challengeRound: {
      skepticAssertion: "Could the blur on the jawline just be normal video compression from Telegram rather than a fake face-swap?",
      forensicResponse: "No. Normal compression blurs the whole screen evenly. Here, the blur is only around the mouth and jaw, while the shirt collar and background stay sharp. That only happens when a new face is pasted onto a body.",
      adjudicatorNote: "The forensic check confirms the blur is only on the face, proving it was digitally edited."
    },
    agreementDisagreement: {
      agreements: [
        "Both agree the video came from an anonymous, unverified source.",
        "Both agree flight records prove the ambassador was not in Geneva.",
        "Both agree no genuine news outlets covered the event."
      ],
      disagreements: [
        "The Skeptic wondered if it was an actor; the Analyst showed it was a digital face-swap."
      ],
      unresolvedQuestions: [
        "Who created and shared the video?"
      ]
    },
    finalAssessment: {
      outcome: "Potential manipulation indicators",
      verdictSummary: "This video is very likely a deepfake. Official flight records prove the ambassador was on an airplane at the time, and video checks reveal clear digital seams around the jaw and a cloned voice.",
      groundedEvidence: [
        "Flight records prove the ambassador was in an airplane at the time.",
        "Digital editing seams detected along the jawline.",
        "Old 2023 room background used instead of current 2026 setup."
      ],
      limitations: [
        "Without the original file from the phone/camera, we cannot name the exact AI software used.",
        "The anonymous Telegram creator cannot be identified yet."
      ],
      recommendedNextSteps: [
        "Release a public note citing the ambassador's verified flight records.",
        "Compare the clip with 2023 UN archives to find the original video used to make the fake."
      ]
    }
  },
  {
    id: "sample-bank-liquidity",
    title: "Viral Audio: Central Bank Freezing Bank Accounts",
    category: "Financial Audio",
    claim: "An audio clip forwarded on WhatsApp claims the Central Bank announced an immediate 48-hour freeze on bank transfers and ATM withdrawals.",
    evidenceProvided: "A 32-second voice message forwarded many times in family and trading chat groups. The voice sounds urgent with quiet air conditioning hum in the background.",
    knownContext: "The official Central Bank website and all national payment systems show 100% normal operations. No banks reported any transfer issues.",
    skepticAnalysis: {
      unsupportedAssumptions: [
        "Assumes a historic financial emergency would be shared through a WhatsApp voice note instead of a live televised press conference.",
        "Assumes a single official can freeze the nation's banking system alone without a government decree."
      ],
      missingEvidence: [
        "Zero official press releases on the Central Bank website.",
        "No reporting by financial news wires like Reuters or Bloomberg."
      ],
      alternativeExplanations: [
        "An AI voice clone created to cause panic and profit from stock drops.",
        "A recording from an internal training drill leaked out of context."
      ],
      contradictions: [
        "Real-time bank transfers and ATM networks are running normally nationwide.",
        "The official was giving a public speech at a university when this was allegedly recorded."
      ],
      substantiationRequirements: [
        "An official statement on the Central Bank website.",
        "Written notices from major commercial banks."
      ]
    },
    forensicAnalysis: {
      textCharacteristics: "Uses dramatic slang ('lock down your cash') instead of standard banking terms.",
      sourceObservations: "Audio file created in consumer editing software 4 hours before going viral. Origin cannot be traced.",
      visualClues: "Not applicable (audio only).",
      audioClues: "The voice has no natural breathing pauses between sentences and robotic pitch consistency.",
      groundedObservations: [
        "Voice pitch is completely flat with zero human vocal tremors.",
        "No sounds of breathing between long sentences.",
        "National payment networks show 100% uptime with zero payment delays."
      ]
    },
    challengeRound: {
      skepticAssertion: "Could this audio be from a private government disaster simulation exercise rather than an AI clone?",
      forensicResponse: "Even during a drill, humans breathe and have natural tone pitch changes. This audio has zero breath pauses and matches the exact frequency pattern of an AI voice generator.",
      adjudicatorNote: "The lack of human breathing strongly confirms an AI voice clone."
    },
    agreementDisagreement: {
      agreements: [
        "Both agree all banks and payment networks are operating normally.",
        "Both agree the voice note was created to trigger panic.",
        "Both agree no official agency issued any warning."
      ],
      disagreements: [
        "The Skeptic questioned the motive; the Analyst showed patterns matching stock manipulation scams."
      ],
      unresolvedQuestions: [
        "Did the person who posted this profit from trading on the panic?"
      ]
    },
    finalAssessment: {
      outcome: "Misleading context suspected",
      verdictSummary: "The audio note is fake and deceptive. All national payment systems are operating normally, and audio testing shows the clip was generated using an AI voice clone.",
      groundedEvidence: [
        "Bank payment networks show normal operations with zero errors.",
        "Robotic tone with zero human breath sounds in the voice recording.",
        "The official was speaking at a university event at the claimed time."
      ],
      limitations: [
        "We cannot identify the exact computer where the voice clone was rendered."
      ],
      recommendedNextSteps: [
        "Banks should post an alert confirming services are fully operational.",
        "Share a public debunking notice to stop the audio from spreading on WhatsApp."
      ]
    }
  },
  {
    id: "sample-submerged-datacenter",
    title: "Leaked Photo: Flooded AI Server Facility",
    category: "Infrastructure Photo",
    claim: "A leaked photo claims catastrophic ocean flooding destroyed a major AI company's underground server center in Norway.",
    evidenceProvided: "A crisp photo showing glowing server racks halfway under turbulent water with flashing red emergency lights.",
    knownContext: "The company's cloud status dashboard shows 100% normal uptime. Local marine sensors recorded no leaks, tidal surges, or earthquakes.",
    skepticAnalysis: {
      unsupportedAssumptions: [
        "Assumes an actual data center would have exposed neon wires dangling in water.",
        "Assumes high-voltage electrical servers would stay lit underwater without short-circuiting."
      ],
      missingEvidence: [
        "No employee posts or news reports about an outage.",
        "No drop in speed or availability on the company's AI services."
      ],
      alternativeExplanations: [
        "An AI-generated picture made with Midjourney or DALL-E for fun or sci-fi art.",
        "A 3D computer graphic from a video game passed off as real."
      ],
      contradictions: [
        "Warning labels on the servers have distorted, unreadable gibberish letters.",
        "The water reflections don't line up with the ceiling lights."
      ],
      substantiationRequirements: [
        "Incident report from the local fire department or coastal guard.",
        "Noticeable service disruptions on the AI platform."
      ]
    },
    forensicAnalysis: {
      textCharacteristics: "Warning signs on the servers show fake, garbled AI letters ('CAUTON: NYDRO-VOLT FLUX').",
      sourceObservations: "The image has metadata matching AI image generation tools.",
      visualClues: "Cables fade into concrete without plugs. A hand reflected in the water has 6 fingers.",
      audioClues: "Not applicable.",
      groundedObservations: [
        "Warning labels contain garbled, nonsense letters common in AI images.",
        "Reflected hand in the puddle has six distinct fingers.",
        "The company's servers processed millions of requests with zero downtime."
      ]
    },
    challengeRound: {
      skepticAssertion: "Could this be an experimental sealed underwater test capsule rather than an AI image?",
      forensicResponse: "Real test capsules are sealed metal cylinders, not rooms with loose wires. More importantly, the reflection in the water shows a human hand with six fingers—a classic sign of AI image generation.",
      adjudicatorNote: "The six-fingered reflection and garbled text prove this is an AI-generated image."
    },
    agreementDisagreement: {
      agreements: [
        "Both agree the photo is an AI-generated image, not a real accident.",
        "Both agree server operations have had zero downtime."
      ],
      disagreements: [
        "The Skeptic suggested it was harmless sci-fi art; the Analyst noted it was shared to manipulate tech stocks."
      ],
      unresolvedQuestions: [
        "Was the image created intentionally to harm the company's stock price?"
      ]
    },
    finalAssessment: {
      outcome: "Potential manipulation indicators",
      verdictSummary: "The photo is an AI-generated fake. Glitches typical of AI image generators—including garbled sign text and a reflection with six fingers—along with 100% normal server uptime prove the claim is false.",
      groundedEvidence: [
        "Garbled, unreadable text on the server labels.",
        "Water reflection clearly shows a hand with 6 fingers.",
        "Server status monitoring confirms 100% normal uptime."
      ],
      limitations: [
        "The exact text prompt used to generate the image cannot be recovered from the photo alone."
      ],
      recommendedNextSteps: [
        "Label the photo as AI-generated on social media platforms.",
        "Refer inquiries to the public cloud service status page."
      ]
    }
  }
];
