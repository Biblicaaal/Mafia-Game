'use strict';
var PROVIDENCE_STARTER_EVENT_PACK_V01 = [
  {
    "id": "SOC_001_FAMILY_DINNER",
    "title": "Family Dinner",
    "category": "SOCIAL",
    "severity": "GOOD",
    "tags": [
      "social",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "A family member has enough familiarity or goodwill to invite the player.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "SOC_001_FAMILY_DINNER_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.opinion",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Target opinion +6"
      },
      {
        "effectId": "SOC_001_FAMILY_DINNER_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.familiarity",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Familiarity +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A familiar table waits under dim kitchen light. The food is simple, the talk is careful, and for a while the city sounds far away.",
      "longText": "A familiar table waits under dim kitchen light. The food is simple, the talk is careful, and for a while the city sounds far away."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_002_FATHERS_DISAPPOINTMENT",
    "title": "Father's Disappointment",
    "category": "SOCIAL",
    "severity": "BAD",
    "tags": [
      "social",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Father exists and the player's heat or reputation has become worrying.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "SOC_002_FATHERS_DISAPPOINTMENT_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.opinion",
        "operation": "subtract",
        "value": 7,
        "playerVisible": true,
        "displayText": "Target opinion -7"
      },
      {
        "effectId": "SOC_002_FATHERS_DISAPPOINTMENT_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Grudge +5"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_SOC_002_FATHERS_DISAPPOINTMENT",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Your father does not shout. That makes it worse. He only looks at you as if weighing the man you became against the boy he remembe",
      "longText": "Your father does not shout. That makes it worse. He only looks at you as if weighing the man you became against the boy he remembers."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_003_MOTHERS_QUIET_BLESSING",
    "title": "Mother's Quiet Blessing",
    "category": "SOCIAL",
    "severity": "GOOD",
    "tags": [
      "social",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Mother exists and the player is under stress or instability.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "SOC_003_MOTHERS_QUIET_BLESSING_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.opinion",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Target opinion +6"
      },
      {
        "effectId": "SOC_003_MOTHERS_QUIET_BLESSING_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.familiarity",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Familiarity +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Your mother presses something into your hand before you leave. A prayer card, a folded bill, or maybe just the weight of being lov",
      "longText": "Your mother presses something into your hand before you leave. A prayer card, a folded bill, or maybe just the weight of being loved."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_004_SIBLING_ASKS_FOR_MONEY",
    "title": "Sibling Asks for Money",
    "category": "SOCIAL",
    "severity": "BAD",
    "tags": [
      "social",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "A sibling exists and money pressure has reached the family.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "SOC_004_SIBLING_ASKS_FOR_MONEY_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.opinion",
        "operation": "subtract",
        "value": 7,
        "playerVisible": true,
        "displayText": "Target opinion -7"
      },
      {
        "effectId": "SOC_004_SIBLING_ASKS_FOR_MONEY_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Grudge +5"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_SOC_004_SIBLING_ASKS_FOR_MONEY",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A sibling waits by the stairs, ashamed enough to avoid your eyes but desperate enough not to leave.",
      "longText": "A sibling waits by the stairs, ashamed enough to avoid your eyes but desperate enough not to leave."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_005_SPOUSE_SUSPICION",
    "title": "Spouse Suspicion",
    "category": "SOCIAL",
    "severity": "BAD",
    "tags": [
      "social",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Spouse exists and secrecy, absence, or heat is rising.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "SOC_005_SPOUSE_SUSPICION_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.opinion",
        "operation": "subtract",
        "value": 7,
        "playerVisible": true,
        "displayText": "Target opinion -7"
      },
      {
        "effectId": "SOC_005_SPOUSE_SUSPICION_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Grudge +5"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "SOC_005_SPOUSE_SUSPICION_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "SOC_005_SPOUSE_SUSPICION_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "SOC_005_SPOUSE_SUSPICION_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "SOC_005_SPOUSE_SUSPICION_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "SOC_005_SPOUSE_SUSPICION_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_SOC_005_SPOUSE_SUSPICION",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Your spouse asks where you were. Not loudly. Not yet. But the question sits on the table like a loaded gun.",
      "longText": "Your spouse asks where you were. Not loudly. Not yet. But the question sits on the table like a loaded gun."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_006_OLD_FRIEND_AT_THE_BAR",
    "title": "Old Friend at the Bar",
    "category": "SOCIAL",
    "severity": "NEUTRAL",
    "tags": [
      "social",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "A friend or old contact exists in the social network.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "SOC_006_OLD_FRIEND_AT_THE_BAR_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.familiarity",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Familiarity +5"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "An old friend raises a glass before you recognize the face. Time changed the suit, not the eyes.",
      "longText": "An old friend raises a glass before you recognize the face. Time changed the suit, not the eyes."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_007_PUBLIC_INSULT",
    "title": "Public Insult",
    "category": "SOCIAL",
    "severity": "VERY_BAD",
    "tags": [
      "social",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "A rival or proud character has low opinion and social tension is high.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "SOC_007_PUBLIC_INSULT_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.trust",
        "operation": "subtract",
        "value": 14,
        "playerVisible": true,
        "displayText": "Trust -14"
      },
      {
        "effectId": "SOC_007_PUBLIC_INSULT_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 16,
        "playerVisible": true,
        "displayText": "Grudge +16"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_SOC_007_PUBLIC_INSULT",
        "title": "Public Insult",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_SOC_007_PUBLIC_INSULT",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The room goes quiet after the insult lands. Everyone waits to see if you swallow it or make an example.",
      "longText": "The room goes quiet after the insult lands. Everyone waits to see if you swallow it or make an example."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_008_A_CHILDS_QUESTION",
    "title": "A Child's Question",
    "category": "SOCIAL",
    "severity": "NEUTRAL",
    "tags": [
      "social",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "A child or young relative exists.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "SOC_008_A_CHILDS_QUESTION_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.familiarity",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Familiarity +5"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A child asks what you do for work. For once, the lie takes effort.",
      "longText": "A child asks what you do for work. For once, the lie takes effort."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_009_HOSPITAL_VISIT",
    "title": "Hospital Visit",
    "category": "SOCIAL",
    "severity": "GOOD",
    "tags": [
      "social",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "A known character is wounded, sick, or stressed.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "SOC_009_HOSPITAL_VISIT_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.opinion",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Target opinion +6"
      },
      {
        "effectId": "SOC_009_HOSPITAL_VISIT_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.familiarity",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Familiarity +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The hospital smells of bleach and bad luck. Showing up matters more than what you say.",
      "longText": "The hospital smells of bleach and bad luck. Showing up matters more than what you say."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_010_FUNERAL_ATTENDANCE",
    "title": "Funeral Attendance",
    "category": "SOCIAL",
    "severity": "CRITICAL",
    "tags": [
      "social",
      "critical",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 2,
    "cooldownDays": 60,
    "cause": "A death memory exists in family or mafia circles.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.momentum",
        "operator": "<",
        "value": 30,
        "weightAdd": 5
      }
    ],
    "immediateEffects": [
      {
        "effectId": "SOC_010_FUNERAL_ATTENDANCE_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.familiarity",
        "operation": "add",
        "value": 15,
        "playerVisible": true,
        "displayText": "Familiarity +15"
      },
      {
        "effectId": "SOC_010_FUNERAL_ATTENDANCE_E2",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.momentum",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Momentum +8"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "SOC_010_FUNERAL_ATTENDANCE_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "SOC_010_FUNERAL_ATTENDANCE_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "SOC_010_FUNERAL_ATTENDANCE_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "SOC_010_FUNERAL_ATTENDANCE_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "SOC_010_FUNERAL_ATTENDANCE_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_SOC_010_FUNERAL_ATTENDANCE",
        "title": "Funeral Attendance",
        "type": "CRITICAL",
        "intensity": 85,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_SOC_010_FUNERAL_ATTENDANCE",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Black coats gather under a gray sky. The living measure each other more carefully than the dead.",
      "longText": "Black coats gather under a gray sky. The living measure each other more carefully than the dead."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_011_JEALOUS_RELATIVE",
    "title": "Jealous Relative",
    "category": "SOCIAL",
    "severity": "BAD",
    "tags": [
      "social",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "A family member has jealousy or rivalry pressure.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "SOC_011_JEALOUS_RELATIVE_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.opinion",
        "operation": "subtract",
        "value": 7,
        "playerVisible": true,
        "displayText": "Target opinion -7"
      },
      {
        "effectId": "SOC_011_JEALOUS_RELATIVE_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Grudge +5"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_SOC_011_JEALOUS_RELATIVE",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A relative smiles too late and congratulates you too softly. The words are kind. The meaning is not.",
      "longText": "A relative smiles too late and congratulates you too softly. The words are kind. The meaning is not."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_012_DEEP_CONFESSION",
    "title": "Deep Confession",
    "category": "SOCIAL",
    "severity": "VERY_GOOD",
    "tags": [
      "social",
      "very_good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 40,
    "cause": "A trusted character has high familiarity and stress.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "SOC_012_DEEP_CONFESSION_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.trust",
        "operation": "add",
        "value": 14,
        "playerVisible": true,
        "displayText": "Trust +14"
      },
      {
        "effectId": "SOC_012_DEEP_CONFESSION_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.loyalty",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Loyalty +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_SOC_012_DEEP_CONFESSION",
        "title": "Deep Confession",
        "type": "VERY_GOOD",
        "intensity": 75,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Someone tells you a truth they have been carrying alone. It is either a gift or a weapon.",
      "longText": "Someone tells you a truth they have been carrying alone. It is either a gift or a weapon."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_013_ROMANTIC_SPARK",
    "title": "Romantic Spark",
    "category": "SOCIAL",
    "severity": "GOOD",
    "tags": [
      "social",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "An eligible romantic target exists and social conditions align.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "SOC_013_ROMANTIC_SPARK_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.opinion",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Target opinion +6"
      },
      {
        "effectId": "SOC_013_ROMANTIC_SPARK_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.familiarity",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Familiarity +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A glance lasts longer than it should. In this city, even tenderness can become leverage.",
      "longText": "A glance lasts longer than it should. In this city, even tenderness can become leverage."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_014_AFFAIR_RUMOR",
    "title": "Affair Rumor",
    "category": "SOCIAL",
    "severity": "VERY_BAD",
    "tags": [
      "social",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "A spouse/lover exists and rumor pressure is active.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "SOC_014_AFFAIR_RUMOR_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.trust",
        "operation": "subtract",
        "value": 14,
        "playerVisible": true,
        "displayText": "Trust -14"
      },
      {
        "effectId": "SOC_014_AFFAIR_RUMOR_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 16,
        "playerVisible": true,
        "displayText": "Grudge +16"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_SOC_014_AFFAIR_RUMOR",
        "title": "Affair Rumor",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_SOC_014_AFFAIR_RUMOR",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The rumor reaches home before you do.",
      "longText": "The rumor reaches home before you do."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_015_MENTOR_MOMENT",
    "title": "Mentor Moment",
    "category": "SOCIAL",
    "severity": "GOOD",
    "tags": [
      "social",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "An older respected character exists with mentor potential.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "SOC_015_MENTOR_MOMENT_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.opinion",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Target opinion +6"
      },
      {
        "effectId": "SOC_015_MENTOR_MOMENT_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.familiarity",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Familiarity +8"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "SOC_015_MENTOR_MOMENT_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "SOC_015_MENTOR_MOMENT_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "SOC_015_MENTOR_MOMENT_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "SOC_015_MENTOR_MOMENT_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "SOC_015_MENTOR_MOMENT_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "An older hand corrects your grip, your tone, or your thinking. The lesson is small, but it stays.",
      "longText": "An older hand corrects your grip, your tone, or your thinking. The lesson is small, but it stays."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_016_SIBLING_RIVALRY_SPARK",
    "title": "Sibling Rivalry Spark",
    "category": "SOCIAL",
    "severity": "BAD",
    "tags": [
      "social",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Sibling exists and jealousy/ambition pressure is rising.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "SOC_016_SIBLING_RIVALRY_SPARK_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.opinion",
        "operation": "subtract",
        "value": 7,
        "playerVisible": true,
        "displayText": "Target opinion -7"
      },
      {
        "effectId": "SOC_016_SIBLING_RIVALRY_SPARK_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Grudge +5"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_SOC_016_SIBLING_RIVALRY_SPARK",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Your sibling does not hate you. Not exactly. But they are tired of standing in your shadow.",
      "longText": "Your sibling does not hate you. Not exactly. But they are tired of standing in your shadow."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_017_A_FAVOR_REMEMBERED",
    "title": "A Favor Remembered",
    "category": "SOCIAL",
    "severity": "GOOD",
    "tags": [
      "social",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "A prior positive memory exists.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "SOC_017_A_FAVOR_REMEMBERED_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.opinion",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Target opinion +6"
      },
      {
        "effectId": "SOC_017_A_FAVOR_REMEMBERED_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.familiarity",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Familiarity +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Someone remembers what you did when they had nothing to offer back.",
      "longText": "Someone remembers what you did when they had nothing to offer back."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_018_A_DEBT_REMEMBERED",
    "title": "A Debt Remembered",
    "category": "SOCIAL",
    "severity": "BAD",
    "tags": [
      "social",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "A prior unpaid favor or debt seed exists.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "SOC_018_A_DEBT_REMEMBERED_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.opinion",
        "operation": "subtract",
        "value": 7,
        "playerVisible": true,
        "displayText": "Target opinion -7"
      },
      {
        "effectId": "SOC_018_A_DEBT_REMEMBERED_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Grudge +5"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_SOC_018_A_DEBT_REMEMBERED",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The city has a long memory, especially when money is involved.",
      "longText": "The city has a long memory, especially when money is involved."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_019_FAMILY_ARGUMENT",
    "title": "Family Argument",
    "category": "SOCIAL",
    "severity": "BAD",
    "tags": [
      "social",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Family member exists and player stress is high.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "SOC_019_FAMILY_ARGUMENT_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.opinion",
        "operation": "subtract",
        "value": 7,
        "playerVisible": true,
        "displayText": "Target opinion -7"
      },
      {
        "effectId": "SOC_019_FAMILY_ARGUMENT_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Grudge +5"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_SOC_019_FAMILY_ARGUMENT",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Dinner becomes trial. Every old wound finds a voice.",
      "longText": "Dinner becomes trial. Every old wound finds a voice."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_020_UNEXPECTED_GIFT",
    "title": "Unexpected Gift",
    "category": "SOCIAL",
    "severity": "GOOD",
    "tags": [
      "social",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "A positive family relationship exists.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "SOC_020_UNEXPECTED_GIFT_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.opinion",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Target opinion +6"
      },
      {
        "effectId": "SOC_020_UNEXPECTED_GIFT_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.familiarity",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Familiarity +8"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "SOC_020_UNEXPECTED_GIFT_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "SOC_020_UNEXPECTED_GIFT_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "SOC_020_UNEXPECTED_GIFT_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "SOC_020_UNEXPECTED_GIFT_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "SOC_020_UNEXPECTED_GIFT_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A family member gives more than they can afford and pretends it is nothing.",
      "longText": "A family member gives more than they can afford and pretends it is nothing."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_021_BLOOD_FEUD_WHISPER",
    "title": "Blood Feud Whisper",
    "category": "SOCIAL",
    "severity": "VERY_BAD",
    "tags": [
      "social",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "A family grudge or killed-relative memory exists.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "SOC_021_BLOOD_FEUD_WHISPER_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.trust",
        "operation": "subtract",
        "value": 14,
        "playerVisible": true,
        "displayText": "Trust -14"
      },
      {
        "effectId": "SOC_021_BLOOD_FEUD_WHISPER_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 16,
        "playerVisible": true,
        "displayText": "Grudge +16"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_SOC_021_BLOOD_FEUD_WHISPER",
        "title": "Blood Feud Whisper",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_SOC_021_BLOOD_FEUD_WHISPER",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A name is spoken in the back room and every conversation after it sounds like preparation.",
      "longText": "A name is spoken in the back room and every conversation after it sounds like preparation."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_022_SPOUSE_COMFORTS_YOU",
    "title": "Spouse Comforts You",
    "category": "SOCIAL",
    "severity": "GOOD",
    "tags": [
      "social",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Spouse exists and the player's stress is high.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "SOC_022_SPOUSE_COMFORTS_YOU_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.opinion",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Target opinion +6"
      },
      {
        "effectId": "SOC_022_SPOUSE_COMFORTS_YOU_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.familiarity",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Familiarity +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "For a rare night, no one asks for orders. Someone simply sits beside you.",
      "longText": "For a rare night, no one asks for orders. Someone simply sits beside you."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_023_FRIEND_NEEDS_PROTECTION",
    "title": "Friend Needs Protection",
    "category": "SOCIAL",
    "severity": "NEUTRAL",
    "tags": [
      "social",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "A friend/contact exists and danger is plausible.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "SOC_023_FRIEND_NEEDS_PROTECTION_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.familiarity",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Familiarity +5"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A friend has been followed twice this week. They laugh when they tell you. Their hands do not.",
      "longText": "A friend has been followed twice this week. They laugh when they tell you. Their hands do not."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_024_OLD_LOVER_RETURNS",
    "title": "Old Lover Returns",
    "category": "SOCIAL",
    "severity": "NEUTRAL",
    "tags": [
      "social",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "A former lover or romantic seed exists.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "SOC_024_OLD_LOVER_RETURNS_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.familiarity",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Familiarity +5"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The past walks in wearing a familiar perfume and an unfamiliar smile.",
      "longText": "The past walks in wearing a familiar perfume and an unfamiliar smile."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "SOC_025_FAMILY_SHAME",
    "title": "Family Shame",
    "category": "SOCIAL",
    "severity": "VERY_BAD",
    "tags": [
      "social",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Heat or violence rises too fast and family values are high.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "target character",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "SOC_025_FAMILY_SHAME_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.trust",
        "operation": "subtract",
        "value": 14,
        "playerVisible": true,
        "displayText": "Trust -14"
      },
      {
        "effectId": "SOC_025_FAMILY_SHAME_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 16,
        "playerVisible": true,
        "displayText": "Grudge +16"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "SOC_025_FAMILY_SHAME_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "SOC_025_FAMILY_SHAME_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "SOC_025_FAMILY_SHAME_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "SOC_025_FAMILY_SHAME_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "SOC_025_FAMILY_SHAME_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_SOC_025_FAMILY_SHAME",
        "title": "Family Shame",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_SOC_025_FAMILY_SHAME",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Someone in the family crosses the street to avoid being seen with you.",
      "longText": "Someone in the family crosses the street to avoid being seen with you."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_001_SOLDIER_REQUESTS_PROMOTION",
    "title": "Soldier Requests Promotion",
    "category": "MAFIA",
    "severity": "NEUTRAL",
    "tags": [
      "mafia",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "A soldier has strong performance or ambition.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_001_SOLDIER_REQUESTS_PROMOTION_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "add",
        "value": 1,
        "playerVisible": true,
        "displayText": "Internal stability +1"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A soldier waits after the meeting. He does not ask loudly. Ambition rarely does when it wants to survive.",
      "longText": "A soldier waits after the meeting. He does not ask loudly. Ambition rarely does when it wants to survive."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_002_CAPO_MISSES_TRIBUTE",
    "title": "Capo Misses Tribute",
    "category": "MAFIA",
    "severity": "BAD",
    "tags": [
      "mafia",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "A capo underperforms or tribute efficiency drops.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_002_CAPO_MISSES_TRIBUTE_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "subtract",
        "value": 5,
        "playerVisible": true,
        "displayText": "Internal stability -5"
      },
      {
        "effectId": "MAF_002_CAPO_MISSES_TRIBUTE_E2",
        "type": "modifyVariable",
        "targetResolver": "random member",
        "variableId": "character.betrayalRisk",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Betrayal risk +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_MAF_002_CAPO_MISSES_TRIBUTE",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The envelope is light. The explanation is heavier.",
      "longText": "The envelope is light. The explanation is heavier."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_003_ASSOCIATE_PROVES_USEFUL",
    "title": "Associate Proves Useful",
    "category": "MAFIA",
    "severity": "GOOD",
    "tags": [
      "mafia",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "An associate's performance or opportunity score rises.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_003_ASSOCIATE_PROVES_USEFUL_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.familyLoyalty",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Family loyalty +4"
      },
      {
        "effectId": "MAF_003_ASSOCIATE_PROVES_USEFUL_E2",
        "type": "modifyVariable",
        "targetResolver": "random member",
        "variableId": "character.performance",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Performance +6"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "An associate solves a problem before anyone asked. That is either talent or ambition.",
      "longText": "An associate solves a problem before anyone asked. That is either talent or ambition."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_004_CREW_DISPUTE",
    "title": "Crew Dispute",
    "category": "MAFIA",
    "severity": "BAD",
    "tags": [
      "mafia",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Internal stability is low or ambition is high.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_004_CREW_DISPUTE_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "subtract",
        "value": 5,
        "playerVisible": true,
        "displayText": "Internal stability -5"
      },
      {
        "effectId": "MAF_004_CREW_DISPUTE_E2",
        "type": "modifyVariable",
        "targetResolver": "random member",
        "variableId": "character.betrayalRisk",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Betrayal risk +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_MAF_004_CREW_DISPUTE",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Two crews argue over a street that barely feeds one of them. Pride makes poor accountants.",
      "longText": "Two crews argue over a street that barely feeds one of them. Pride makes poor accountants."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_005_MADE_MAN_CEREMONY",
    "title": "Made Man Ceremony",
    "category": "MAFIA",
    "severity": "CRITICAL",
    "tags": [
      "mafia",
      "critical",
      "starter-pack"
    ],
    "unique": true,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 2,
    "cooldownDays": 60,
    "cause": "An associate qualifies for Soldier and approval exists.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.momentum",
        "operator": "<",
        "value": 30,
        "weightAdd": 5
      },
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_005_MADE_MAN_CEREMONY_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.successionStability",
        "operation": "subtract",
        "value": 8,
        "playerVisible": true,
        "displayText": "Succession stability -8"
      },
      {
        "effectId": "MAF_005_MADE_MAN_CEREMONY_E2",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.momentum",
        "operation": "add",
        "value": 10,
        "playerVisible": true,
        "displayText": "Momentum +10"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "MAF_005_MADE_MAN_CEREMONY_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "MAF_005_MADE_MAN_CEREMONY_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "MAF_005_MADE_MAN_CEREMONY_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "MAF_005_MADE_MAN_CEREMONY_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "MAF_005_MADE_MAN_CEREMONY_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_MAF_005_MADE_MAN_CEREMONY",
        "title": "Made Man Ceremony",
        "type": "CRITICAL",
        "intensity": 85,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_MAF_005_MADE_MAN_CEREMONY",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The room is quiet enough to hear the match strike. A man enters as one thing and leaves as another.",
      "longText": "The room is quiet enough to hear the match strike. A man enters as one thing and leaves as another."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_006_UNDERBOSS_PRESSURE",
    "title": "Underboss Pressure",
    "category": "MAFIA",
    "severity": "BAD",
    "tags": [
      "mafia",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Underboss exists and ambition is high.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_006_UNDERBOSS_PRESSURE_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "subtract",
        "value": 5,
        "playerVisible": true,
        "displayText": "Internal stability -5"
      },
      {
        "effectId": "MAF_006_UNDERBOSS_PRESSURE_E2",
        "type": "modifyVariable",
        "targetResolver": "random member",
        "variableId": "character.betrayalRisk",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Betrayal risk +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_MAF_006_UNDERBOSS_PRESSURE",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The underboss agrees too quickly, smiles too little, and leaves with too many men behind him.",
      "longText": "The underboss agrees too quickly, smiles too little, and leaves with too many men behind him."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_007_CONSIGLIERE_WARNING",
    "title": "Consigliere Warning",
    "category": "MAFIA",
    "severity": "NEUTRAL",
    "tags": [
      "mafia",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "Consigliere exists and heat or instability is rising.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_007_CONSIGLIERE_WARNING_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "add",
        "value": 1,
        "playerVisible": true,
        "displayText": "Internal stability +1"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The consigliere says nothing dramatic. That is how you know the warning is serious.",
      "longText": "The consigliere says nothing dramatic. That is how you know the warning is serious."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_008_SKIMMED_TRIBUTE",
    "title": "Skimmed Tribute",
    "category": "MAFIA",
    "severity": "VERY_BAD",
    "tags": [
      "mafia",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Greedy member exists or tribute mismatch detected.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_008_SKIMMED_TRIBUTE_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "subtract",
        "value": 12,
        "playerVisible": true,
        "displayText": "Internal stability -12"
      },
      {
        "effectId": "MAF_008_SKIMMED_TRIBUTE_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Law heat +5"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_MAF_008_SKIMMED_TRIBUTE",
        "title": "Skimmed Tribute",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_MAF_008_SKIMMED_TRIBUTE",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Someone has been shaving coins off the family plate. Small theft, large insult.",
      "longText": "Someone has been shaving coins off the family plate. Small theft, large insult."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_009_RELIABLE_EARNER",
    "title": "Reliable Earner",
    "category": "MAFIA",
    "severity": "GOOD",
    "tags": [
      "mafia",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "An earner exceeds expected tribute.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_009_RELIABLE_EARNER_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.familyLoyalty",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Family loyalty +4"
      },
      {
        "effectId": "MAF_009_RELIABLE_EARNER_E2",
        "type": "modifyVariable",
        "targetResolver": "random member",
        "variableId": "character.performance",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Performance +6"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "One envelope arrives heavy, early, and without excuses.",
      "longText": "One envelope arrives heavy, early, and without excuses."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_010_CREW_LEADER_INJURED",
    "title": "Crew Leader Injured",
    "category": "MAFIA",
    "severity": "VERY_BAD",
    "tags": [
      "mafia",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Violence or trouble pressure is high.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_010_CREW_LEADER_INJURED_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "subtract",
        "value": 12,
        "playerVisible": true,
        "displayText": "Internal stability -12"
      },
      {
        "effectId": "MAF_010_CREW_LEADER_INJURED_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Law heat +5"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "MAF_010_CREW_LEADER_INJURED_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "MAF_010_CREW_LEADER_INJURED_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "MAF_010_CREW_LEADER_INJURED_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "MAF_010_CREW_LEADER_INJURED_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "MAF_010_CREW_LEADER_INJURED_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_MAF_010_CREW_LEADER_INJURED",
        "title": "Crew Leader Injured",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_MAF_010_CREW_LEADER_INJURED",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A crew loses its voice for a week. Men who need orders start inventing their own.",
      "longText": "A crew loses its voice for a week. Men who need orders start inventing their own."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_011_VACANT_ROLE_ANXIETY",
    "title": "Vacant Role Anxiety",
    "category": "MAFIA",
    "severity": "BAD",
    "tags": [
      "mafia",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "A critical role is vacant.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_011_VACANT_ROLE_ANXIETY_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "subtract",
        "value": 5,
        "playerVisible": true,
        "displayText": "Internal stability -5"
      },
      {
        "effectId": "MAF_011_VACANT_ROLE_ANXIETY_E2",
        "type": "modifyVariable",
        "targetResolver": "random member",
        "variableId": "character.betrayalRisk",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Betrayal risk +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_MAF_011_VACANT_ROLE_ANXIETY",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A chair sits empty at the table. Everyone pretends not to look at it.",
      "longText": "A chair sits empty at the table. Everyone pretends not to look at it."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_012_STREET_PUNK_IMPRESSES_SOLDIER",
    "title": "Street Punk Impresses Soldier",
    "category": "MAFIA",
    "severity": "GOOD",
    "tags": [
      "mafia",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Low-level member performs well under pressure.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_012_STREET_PUNK_IMPRESSES_SOLDIER_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.familyLoyalty",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Family loyalty +4"
      },
      {
        "effectId": "MAF_012_STREET_PUNK_IMPRESSES_SOLDIER_E2",
        "type": "modifyVariable",
        "targetResolver": "random member",
        "variableId": "character.performance",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Performance +6"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A street punk keeps his mouth shut under pressure. That kind of silence is worth noticing.",
      "longText": "A street punk keeps his mouth shut under pressure. That kind of silence is worth noticing."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_013_INTERNAL_AUDIT",
    "title": "Internal Audit",
    "category": "MAFIA",
    "severity": "NEUTRAL",
    "tags": [
      "mafia",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "Consigliere/accountant exists or finances are suspicious.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_013_INTERNAL_AUDIT_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "add",
        "value": 1,
        "playerVisible": true,
        "displayText": "Internal stability +1"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Books are opened. Men who were laughing before suddenly remember appointments.",
      "longText": "Books are opened. Men who were laughing before suddenly remember appointments."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_014_CREW_MUTINY_RUMOR",
    "title": "Crew Mutiny Rumor",
    "category": "MAFIA",
    "severity": "VERY_BAD",
    "tags": [
      "mafia",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Crew loyalty is low or Don respect is weak.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_014_CREW_MUTINY_RUMOR_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "subtract",
        "value": 12,
        "playerVisible": true,
        "displayText": "Internal stability -12"
      },
      {
        "effectId": "MAF_014_CREW_MUTINY_RUMOR_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Law heat +5"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_MAF_014_CREW_MUTINY_RUMOR",
        "title": "Crew Mutiny Rumor",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_MAF_014_CREW_MUTINY_RUMOR",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The rumor arrives through three mouths and none of them want to be named.",
      "longText": "The rumor arrives through three mouths and none of them want to be named."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_015_CAPO_REQUESTS_SITDOWN",
    "title": "Capo Requests Sitdown",
    "category": "MAFIA",
    "severity": "NEUTRAL",
    "tags": [
      "mafia",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "Two crews conflict or capo has a complaint.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_015_CAPO_REQUESTS_SITDOWN_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "add",
        "value": 1,
        "playerVisible": true,
        "displayText": "Internal stability +1"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "MAF_015_CAPO_REQUESTS_SITDOWN_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "MAF_015_CAPO_REQUESTS_SITDOWN_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "MAF_015_CAPO_REQUESTS_SITDOWN_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "MAF_015_CAPO_REQUESTS_SITDOWN_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "MAF_015_CAPO_REQUESTS_SITDOWN_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A capo requests a sitdown, which means the argument has already outgrown shouting.",
      "longText": "A capo requests a sitdown, which means the argument has already outgrown shouting."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_016_PUNISHMENT_EXPECTED",
    "title": "Punishment Expected",
    "category": "MAFIA",
    "severity": "BAD",
    "tags": [
      "mafia",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "A failed tribute or betrayal seed exists.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_016_PUNISHMENT_EXPECTED_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "subtract",
        "value": 5,
        "playerVisible": true,
        "displayText": "Internal stability -5"
      },
      {
        "effectId": "MAF_016_PUNISHMENT_EXPECTED_E2",
        "type": "modifyVariable",
        "targetResolver": "random member",
        "variableId": "character.betrayalRisk",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Betrayal risk +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_MAF_016_PUNISHMENT_EXPECTED",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The men are watching. Mercy and weakness look similar from the cheap seats.",
      "longText": "The men are watching. Mercy and weakness look similar from the cheap seats."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_017_PUNISHMENT_DELIVERED",
    "title": "Punishment Delivered",
    "category": "MAFIA",
    "severity": "VERY_BAD",
    "tags": [
      "mafia",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Player chooses punishment or discipline event chain.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_017_PUNISHMENT_DELIVERED_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "subtract",
        "value": 12,
        "playerVisible": true,
        "displayText": "Internal stability -12"
      },
      {
        "effectId": "MAF_017_PUNISHMENT_DELIVERED_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Law heat +5"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_MAF_017_PUNISHMENT_DELIVERED",
        "title": "Punishment Delivered",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_MAF_017_PUNISHMENT_DELIVERED",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The lesson is not subtle. Subtle lessons do not travel fast enough.",
      "longText": "The lesson is not subtle. Subtle lessons do not travel fast enough."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_018_PROMOTION_JEALOUSY",
    "title": "Promotion Jealousy",
    "category": "MAFIA",
    "severity": "BAD",
    "tags": [
      "mafia",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Recent promotion happened.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_018_PROMOTION_JEALOUSY_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "subtract",
        "value": 5,
        "playerVisible": true,
        "displayText": "Internal stability -5"
      },
      {
        "effectId": "MAF_018_PROMOTION_JEALOUSY_E2",
        "type": "modifyVariable",
        "targetResolver": "random member",
        "variableId": "character.betrayalRisk",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Betrayal risk +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_MAF_018_PROMOTION_JEALOUSY",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "One man's rise becomes three men's insult.",
      "longText": "One man's rise becomes three men's insult."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_019_NEW_SPECIALIST_CONTACT",
    "title": "New Specialist Contact",
    "category": "MAFIA",
    "severity": "GOOD",
    "tags": [
      "mafia",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Opportunity pressure or recruitment strength is active.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_019_NEW_SPECIALIST_CONTACT_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.familyLoyalty",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Family loyalty +4"
      },
      {
        "effectId": "MAF_019_NEW_SPECIALIST_CONTACT_E2",
        "type": "modifyVariable",
        "targetResolver": "random member",
        "variableId": "character.performance",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Performance +6"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A man with clean hands and dirty usefulness is introduced after midnight.",
      "longText": "A man with clean hands and dirty usefulness is introduced after midnight."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_020_LAWYER_OFFERS_HELP",
    "title": "Lawyer Offers Help",
    "category": "MAFIA",
    "severity": "GOOD",
    "tags": [
      "mafia",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Law heat is rising.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_020_LAWYER_OFFERS_HELP_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.familyLoyalty",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Family loyalty +4"
      },
      {
        "effectId": "MAF_020_LAWYER_OFFERS_HELP_E2",
        "type": "modifyVariable",
        "targetResolver": "random member",
        "variableId": "character.performance",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Performance +6"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "MAF_020_LAWYER_OFFERS_HELP_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "MAF_020_LAWYER_OFFERS_HELP_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "MAF_020_LAWYER_OFFERS_HELP_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "MAF_020_LAWYER_OFFERS_HELP_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "MAF_020_LAWYER_OFFERS_HELP_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A lawyer with a soft voice and expensive shoes says he can make certain problems slower.",
      "longText": "A lawyer with a soft voice and expensive shoes says he can make certain problems slower."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_021_RAT_SUSPICION",
    "title": "Rat Suspicion",
    "category": "MAFIA",
    "severity": "VERY_BAD",
    "tags": [
      "mafia",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Heat rises without clear cause.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_021_RAT_SUSPICION_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "subtract",
        "value": 12,
        "playerVisible": true,
        "displayText": "Internal stability -12"
      },
      {
        "effectId": "MAF_021_RAT_SUSPICION_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Law heat +5"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_MAF_021_RAT_SUSPICION",
        "title": "Rat Suspicion",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_MAF_021_RAT_SUSPICION",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Nobody says the word rat. That is how you know everyone is thinking it.",
      "longText": "Nobody says the word rat. That is how you know everyone is thinking it."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_022_DONS_FAVOR",
    "title": "Don's Favor",
    "category": "MAFIA",
    "severity": "VERY_GOOD",
    "tags": [
      "mafia",
      "very_good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 40,
    "cause": "Player has high performance or loyalty.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_022_DONS_FAVOR_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.tributeEfficiency",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Tribute efficiency +8"
      },
      {
        "effectId": "MAF_022_DONS_FAVOR_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.familyLoyalty",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Family loyalty +6"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_MAF_022_DONS_FAVOR",
        "title": "Don's Favor",
        "type": "VERY_GOOD",
        "intensity": 75,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A small nod from the top table weighs more than a speech.",
      "longText": "A small nod from the top table weighs more than a speech."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_023_FAILED_JOB_BLAME",
    "title": "Failed Job Blame",
    "category": "MAFIA",
    "severity": "BAD",
    "tags": [
      "mafia",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Recent failed job exists.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_023_FAILED_JOB_BLAME_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "subtract",
        "value": 5,
        "playerVisible": true,
        "displayText": "Internal stability -5"
      },
      {
        "effectId": "MAF_023_FAILED_JOB_BLAME_E2",
        "type": "modifyVariable",
        "targetResolver": "random member",
        "variableId": "character.betrayalRisk",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Betrayal risk +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_MAF_023_FAILED_JOB_BLAME",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The job failed. Now the real work begins: choosing who carries the failure.",
      "longText": "The job failed. Now the real work begins: choosing who carries the failure."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_024_CAPO_DIES",
    "title": "Capo Dies",
    "category": "MAFIA",
    "severity": "CATASTROPHIC",
    "tags": [
      "mafia",
      "catastrophic",
      "starter-pack"
    ],
    "unique": true,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 1,
    "cooldownDays": 90,
    "cause": "High violence, war, or rare fate roll.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_024_CAPO_DIES_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "subtract",
        "value": 25,
        "playerVisible": true,
        "displayText": "Internal stability -25"
      },
      {
        "effectId": "MAF_024_CAPO_DIES_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.successionStability",
        "operation": "subtract",
        "value": 25,
        "playerVisible": true,
        "displayText": "Succession stability -25"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_MAF_024_CAPO_DIES",
        "title": "Capo Dies",
        "type": "CATASTROPHIC",
        "intensity": 95,
        "decayRate": "permanent",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_MAF_024_CAPO_DIES",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A captain is gone. His crew does not become leaderless. It becomes hungry.",
      "longText": "A captain is gone. His crew does not become leaderless. It becomes hungry."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "MAF_025_DON_FALLS_ILL",
    "title": "Don Falls Ill",
    "category": "MAFIA",
    "severity": "CRITICAL",
    "tags": [
      "mafia",
      "critical",
      "starter-pack"
    ],
    "unique": true,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 2,
    "cooldownDays": 60,
    "cause": "Rare health, age, or fate event.",
    "requirements": [
      {
        "type": "characterExists",
        "targetResolver": "random member",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.momentum",
        "operator": "<",
        "value": 30,
        "weightAdd": 5
      },
      {
        "type": "variableWeight",
        "variableId": "mafia.internalStability",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "MAF_025_DON_FALLS_ILL_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.successionStability",
        "operation": "subtract",
        "value": 8,
        "playerVisible": true,
        "displayText": "Succession stability -8"
      },
      {
        "effectId": "MAF_025_DON_FALLS_ILL_E2",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.momentum",
        "operation": "add",
        "value": 10,
        "playerVisible": true,
        "displayText": "Momentum +10"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "MAF_025_DON_FALLS_ILL_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "MAF_025_DON_FALLS_ILL_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "MAF_025_DON_FALLS_ILL_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "MAF_025_DON_FALLS_ILL_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "MAF_025_DON_FALLS_ILL_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_MAF_025_DON_FALLS_ILL",
        "title": "Don Falls Ill",
        "type": "CRITICAL",
        "intensity": 85,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_MAF_025_DON_FALLS_ILL",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The Don's chair is occupied, but the room has already begun imagining it empty.",
      "longText": "The Don's chair is occupied, but the room has already begun imagining it empty."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_001_BOOKMAKER_NEEDS_PROTECTION",
    "title": "Bookmaker Needs Protection",
    "category": "OPPORTUNITY",
    "severity": "GOOD",
    "tags": [
      "opportunity",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "District opportunity rises or player cash is low.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_001_BOOKMAKER_NEEDS_PROTECTION_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.dirtyCash",
        "operation": "add",
        "value": 800,
        "playerVisible": true,
        "displayText": "Dirty cash +800"
      },
      {
        "effectId": "OPP_001_BOOKMAKER_NEEDS_PROTECTION_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "District opportunity +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A bookmaker who used to laugh at protection now asks what it costs.",
      "longText": "A bookmaker who used to laugh at protection now asks what it costs."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_002_VACANT_STOREFRONT",
    "title": "Vacant Storefront",
    "category": "OPPORTUNITY",
    "severity": "GOOD",
    "tags": [
      "opportunity",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Business activity in a district changes.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_002_VACANT_STOREFRONT_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.dirtyCash",
        "operation": "add",
        "value": 800,
        "playerVisible": true,
        "displayText": "Dirty cash +800"
      },
      {
        "effectId": "OPP_002_VACANT_STOREFRONT_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "District opportunity +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A storefront goes dark with the furniture still inside. Empty places invite ownership.",
      "longText": "A storefront goes dark with the furniture still inside. Empty places invite ownership."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_003_EASY_SCORE",
    "title": "Easy Score",
    "category": "OPPORTUNITY",
    "severity": "GOOD",
    "tags": [
      "opportunity",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Fortune is positive or player is struggling.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_003_EASY_SCORE_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.dirtyCash",
        "operation": "add",
        "value": 800,
        "playerVisible": true,
        "displayText": "Dirty cash +800"
      },
      {
        "effectId": "OPP_003_EASY_SCORE_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "District opportunity +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A soft target presents itself with almost insulting carelessness.",
      "longText": "A soft target presents itself with almost insulting carelessness."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_004_RECRUIT_WITH_NERVE",
    "title": "Recruit With Nerve",
    "category": "OPPORTUNITY",
    "severity": "GOOD",
    "tags": [
      "opportunity",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Recruitment strength is low or street activity is high.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_004_RECRUIT_WITH_NERVE_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.dirtyCash",
        "operation": "add",
        "value": 800,
        "playerVisible": true,
        "displayText": "Dirty cash +800"
      },
      {
        "effectId": "OPP_004_RECRUIT_WITH_NERVE_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "District opportunity +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A young face handles fear better than expected.",
      "longText": "A young face handles fear better than expected."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_005_FRIENDLY_CLERK",
    "title": "Friendly Clerk",
    "category": "OPPORTUNITY",
    "severity": "GOOD",
    "tags": [
      "opportunity",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Need for intel or district police pressure exists.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_005_FRIENDLY_CLERK_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.dirtyCash",
        "operation": "add",
        "value": 800,
        "playerVisible": true,
        "displayText": "Dirty cash +800"
      },
      {
        "effectId": "OPP_005_FRIENDLY_CLERK_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "District opportunity +4"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "OPP_005_FRIENDLY_CLERK_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "OPP_005_FRIENDLY_CLERK_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "OPP_005_FRIENDLY_CLERK_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "OPP_005_FRIENDLY_CLERK_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "OPP_005_FRIENDLY_CLERK_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A clerk sees more paperwork than any detective and needs money more than pride.",
      "longText": "A clerk sees more paperwork than any detective and needs money more than pride."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_006_WAREHOUSE_BACK_DOOR",
    "title": "Warehouse Back Door",
    "category": "OPPORTUNITY",
    "severity": "VERY_GOOD",
    "tags": [
      "opportunity",
      "very_good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 40,
    "cause": "Industrial district or docks exist.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_006_WAREHOUSE_BACK_DOOR_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.dirtyCash",
        "operation": "add",
        "value": 2000,
        "playerVisible": true,
        "displayText": "Dirty cash +2000"
      },
      {
        "effectId": "OPP_006_WAREHOUSE_BACK_DOOR_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.recruitmentStrength",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Recruitment strength +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_OPP_006_WAREHOUSE_BACK_DOOR",
        "title": "Warehouse Back Door",
        "type": "VERY_GOOD",
        "intensity": 75,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A warehouse has a back door, a lazy guard, and a schedule nobody respects.",
      "longText": "A warehouse has a back door, a lazy guard, and a schedule nobody respects."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_007_UNION_WHISPER",
    "title": "Union Whisper",
    "category": "OPPORTUNITY",
    "severity": "GOOD",
    "tags": [
      "opportunity",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "District business activity is high.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_007_UNION_WHISPER_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.dirtyCash",
        "operation": "add",
        "value": 800,
        "playerVisible": true,
        "displayText": "Dirty cash +800"
      },
      {
        "effectId": "OPP_007_UNION_WHISPER_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "District opportunity +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A union man hints that loyalty can be rented by the month.",
      "longText": "A union man hints that loyalty can be rented by the month."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_008_POLICE_SCHEDULE_LEAK",
    "title": "Police Schedule Leak",
    "category": "OPPORTUNITY",
    "severity": "VERY_GOOD",
    "tags": [
      "opportunity",
      "very_good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 40,
    "cause": "Corruption strength exists.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_008_POLICE_SCHEDULE_LEAK_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.dirtyCash",
        "operation": "add",
        "value": 2000,
        "playerVisible": true,
        "displayText": "Dirty cash +2000"
      },
      {
        "effectId": "OPP_008_POLICE_SCHEDULE_LEAK_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.recruitmentStrength",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Recruitment strength +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_OPP_008_POLICE_SCHEDULE_LEAK",
        "title": "Police Schedule Leak",
        "type": "VERY_GOOD",
        "intensity": 75,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A paper arrives folded twice. Patrol times. Names. Weakness.",
      "longText": "A paper arrives folded twice. Patrol times. Names. Weakness."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_009_NIGHTCLUB_OWNER_CALLS",
    "title": "Nightclub Owner Calls",
    "category": "OPPORTUNITY",
    "severity": "GOOD",
    "tags": [
      "opportunity",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Player reputation is moderate or high.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_009_NIGHTCLUB_OWNER_CALLS_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.dirtyCash",
        "operation": "add",
        "value": 800,
        "playerVisible": true,
        "displayText": "Dirty cash +800"
      },
      {
        "effectId": "OPP_009_NIGHTCLUB_OWNER_CALLS_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "District opportunity +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The owner of a club says he wants trouble kept outside. Men usually mean the opposite.",
      "longText": "The owner of a club says he wants trouble kept outside. Men usually mean the opposite."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_010_DEBT_BOOK_FOUND",
    "title": "Debt Book Found",
    "category": "OPPORTUNITY",
    "severity": "VERY_GOOD",
    "tags": [
      "opportunity",
      "very_good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 40,
    "cause": "Fate/opportunity roll succeeds.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_010_DEBT_BOOK_FOUND_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.dirtyCash",
        "operation": "add",
        "value": 2000,
        "playerVisible": true,
        "displayText": "Dirty cash +2000"
      },
      {
        "effectId": "OPP_010_DEBT_BOOK_FOUND_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.recruitmentStrength",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Recruitment strength +3"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "OPP_010_DEBT_BOOK_FOUND_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "OPP_010_DEBT_BOOK_FOUND_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "OPP_010_DEBT_BOOK_FOUND_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "OPP_010_DEBT_BOOK_FOUND_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "OPP_010_DEBT_BOOK_FOUND_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_OPP_010_DEBT_BOOK_FOUND",
        "title": "Debt Book Found",
        "type": "VERY_GOOD",
        "intensity": 75,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A small notebook appears with names, numbers, and desperation written in clean columns.",
      "longText": "A small notebook appears with names, numbers, and desperation written in clean columns."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_011_RIVALS_WEAK_CORNER",
    "title": "Rival's Weak Corner",
    "category": "OPPORTUNITY",
    "severity": "GOOD",
    "tags": [
      "opportunity",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Rival pressure is high but control is possible.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_011_RIVALS_WEAK_CORNER_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.dirtyCash",
        "operation": "add",
        "value": 800,
        "playerVisible": true,
        "displayText": "Dirty cash +800"
      },
      {
        "effectId": "OPP_011_RIVALS_WEAK_CORNER_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "District opportunity +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A rival crew leaves a corner underfed. Hunger travels.",
      "longText": "A rival crew leaves a corner underfed. Hunger travels."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_012_QUIET_ACCOUNTANT",
    "title": "Quiet Accountant",
    "category": "OPPORTUNITY",
    "severity": "GOOD",
    "tags": [
      "opportunity",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Clean cash is low or laundering need is high.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_012_QUIET_ACCOUNTANT_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.dirtyCash",
        "operation": "add",
        "value": 800,
        "playerVisible": true,
        "displayText": "Dirty cash +800"
      },
      {
        "effectId": "OPP_012_QUIET_ACCOUNTANT_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "District opportunity +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "An accountant with tired eyes understands numbers better than loyalty.",
      "longText": "An accountant with tired eyes understands numbers better than loyalty."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_013_CHEAP_GUNS",
    "title": "Cheap Guns",
    "category": "OPPORTUNITY",
    "severity": "NEUTRAL",
    "tags": [
      "opportunity",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "Violence pressure or war readiness is low.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_013_CHEAP_GUNS_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Opportunity +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A crate appears at a price low enough to be either luck or bait.",
      "longText": "A crate appears at a price low enough to be either luck or bait."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_014_JUDGES_DRIVER",
    "title": "Judge's Driver",
    "category": "OPPORTUNITY",
    "severity": "VERY_GOOD",
    "tags": [
      "opportunity",
      "very_good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 40,
    "cause": "Federal/law heat is rising.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_014_JUDGES_DRIVER_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.dirtyCash",
        "operation": "add",
        "value": 2000,
        "playerVisible": true,
        "displayText": "Dirty cash +2000"
      },
      {
        "effectId": "OPP_014_JUDGES_DRIVER_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.recruitmentStrength",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Recruitment strength +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_OPP_014_JUDGES_DRIVER",
        "title": "Judge's Driver",
        "type": "VERY_GOOD",
        "intensity": 75,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The judge is untouchable. His driver is not.",
      "longText": "The judge is untouchable. His driver is not."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_015_DOCKSIDE_GAMBLING_LEAD",
    "title": "Dockside Gambling Lead",
    "category": "OPPORTUNITY",
    "severity": "GOOD",
    "tags": [
      "opportunity",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "A district has vice/dock opportunity.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_015_DOCKSIDE_GAMBLING_LEAD_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.dirtyCash",
        "operation": "add",
        "value": 800,
        "playerVisible": true,
        "displayText": "Dirty cash +800"
      },
      {
        "effectId": "OPP_015_DOCKSIDE_GAMBLING_LEAD_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "District opportunity +4"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "OPP_015_DOCKSIDE_GAMBLING_LEAD_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "OPP_015_DOCKSIDE_GAMBLING_LEAD_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "OPP_015_DOCKSIDE_GAMBLING_LEAD_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "OPP_015_DOCKSIDE_GAMBLING_LEAD_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "OPP_015_DOCKSIDE_GAMBLING_LEAD_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A sailor, drunk enough to talk and scared enough to mean it, mentions a floating game.",
      "longText": "A sailor, drunk enough to talk and scared enough to mean it, mentions a floating game."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_016_LOST_TRUCK_ROUTE",
    "title": "Lost Truck Route",
    "category": "OPPORTUNITY",
    "severity": "GOOD",
    "tags": [
      "opportunity",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Driving/street smarts relevant opportunity appears.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_016_LOST_TRUCK_ROUTE_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.dirtyCash",
        "operation": "add",
        "value": 800,
        "playerVisible": true,
        "displayText": "Dirty cash +800"
      },
      {
        "effectId": "OPP_016_LOST_TRUCK_ROUTE_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "District opportunity +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A driver knows a route the police forgot existed.",
      "longText": "A driver knows a route the police forgot existed."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_017_POLITICAL_FUNDRAISER",
    "title": "Political Fundraiser",
    "category": "OPPORTUNITY",
    "severity": "NEUTRAL",
    "tags": [
      "opportunity",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "Election/world seed is active.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_017_POLITICAL_FUNDRAISER_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Opportunity +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A fundraiser needs envelopes and prefers not to ask where they came from.",
      "longText": "A fundraiser needs envelopes and prefers not to ask where they came from."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_018_AMBITIOUS_PROSPECT",
    "title": "Ambitious Prospect",
    "category": "OPPORTUNITY",
    "severity": "GOOD",
    "tags": [
      "opportunity",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Recruitment or street activity is high.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_018_AMBITIOUS_PROSPECT_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.dirtyCash",
        "operation": "add",
        "value": 800,
        "playerVisible": true,
        "displayText": "Dirty cash +800"
      },
      {
        "effectId": "OPP_018_AMBITIOUS_PROSPECT_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "District opportunity +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A prospect volunteers for the dangerous part before anyone explains it.",
      "longText": "A prospect volunteers for the dangerous part before anyone explains it."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_019_ABANDONED_SAFEHOUSE",
    "title": "Abandoned Safehouse",
    "category": "OPPORTUNITY",
    "severity": "GOOD",
    "tags": [
      "opportunity",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Trouble pressure is high.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_019_ABANDONED_SAFEHOUSE_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.dirtyCash",
        "operation": "add",
        "value": 800,
        "playerVisible": true,
        "displayText": "Dirty cash +800"
      },
      {
        "effectId": "OPP_019_ABANDONED_SAFEHOUSE_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "District opportunity +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A locked room is found with dust on the floor and no names on the lease.",
      "longText": "A locked room is found with dust on the floor and no names on the lease."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_020_FRONT_BUSINESS_DISCOUNT",
    "title": "Front Business Discount",
    "category": "OPPORTUNITY",
    "severity": "GOOD",
    "tags": [
      "opportunity",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Prosperity is low or fortune is positive.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_020_FRONT_BUSINESS_DISCOUNT_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.dirtyCash",
        "operation": "add",
        "value": 800,
        "playerVisible": true,
        "displayText": "Dirty cash +800"
      },
      {
        "effectId": "OPP_020_FRONT_BUSINESS_DISCOUNT_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "District opportunity +4"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "OPP_020_FRONT_BUSINESS_DISCOUNT_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "OPP_020_FRONT_BUSINESS_DISCOUNT_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "OPP_020_FRONT_BUSINESS_DISCOUNT_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "OPP_020_FRONT_BUSINESS_DISCOUNT_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "OPP_020_FRONT_BUSINESS_DISCOUNT_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A failing business can be bought for less than its sign is worth.",
      "longText": "A failing business can be bought for less than its sign is worth."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_021_NEWSPAPER_CONTACT",
    "title": "Newspaper Contact",
    "category": "OPPORTUNITY",
    "severity": "GOOD",
    "tags": [
      "opportunity",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Public attention or heat is rising.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_021_NEWSPAPER_CONTACT_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.dirtyCash",
        "operation": "add",
        "value": 800,
        "playerVisible": true,
        "displayText": "Dirty cash +800"
      },
      {
        "effectId": "OPP_021_NEWSPAPER_CONTACT_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "District opportunity +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A reporter prefers paid silence to dangerous truth.",
      "longText": "A reporter prefers paid silence to dangerous truth."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_022_BLACKMAIL_MATERIAL",
    "title": "Blackmail Material",
    "category": "OPPORTUNITY",
    "severity": "VERY_GOOD",
    "tags": [
      "opportunity",
      "very_good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 40,
    "cause": "Intelligence or fate roll succeeds.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_022_BLACKMAIL_MATERIAL_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.dirtyCash",
        "operation": "add",
        "value": 2000,
        "playerVisible": true,
        "displayText": "Dirty cash +2000"
      },
      {
        "effectId": "OPP_022_BLACKMAIL_MATERIAL_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.recruitmentStrength",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Recruitment strength +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_OPP_022_BLACKMAIL_MATERIAL",
        "title": "Blackmail Material",
        "type": "VERY_GOOD",
        "intensity": 75,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A secret falls into your hands already wrapped like a gift.",
      "longText": "A secret falls into your hands already wrapped like a gift."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_023_RELIABLE_DRIVER",
    "title": "Reliable Driver",
    "category": "OPPORTUNITY",
    "severity": "GOOD",
    "tags": [
      "opportunity",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Jobs/transport pressure exists.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_023_RELIABLE_DRIVER_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.dirtyCash",
        "operation": "add",
        "value": 800,
        "playerVisible": true,
        "displayText": "Dirty cash +800"
      },
      {
        "effectId": "OPP_023_RELIABLE_DRIVER_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "District opportunity +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A driver arrives early, sober, and silent. Miracles come in ugly coats.",
      "longText": "A driver arrives early, sober, and silent. Miracles come in ugly coats."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_024_QUIET_WEEK_TO_BUILD",
    "title": "Quiet Week to Build",
    "category": "OPPORTUNITY",
    "severity": "VERY_GOOD",
    "tags": [
      "opportunity",
      "very_good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 40,
    "cause": "Player is struggling or momentum is low.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_024_QUIET_WEEK_TO_BUILD_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.dirtyCash",
        "operation": "add",
        "value": 2000,
        "playerVisible": true,
        "displayText": "Dirty cash +2000"
      },
      {
        "effectId": "OPP_024_QUIET_WEEK_TO_BUILD_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.recruitmentStrength",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Recruitment strength +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_OPP_024_QUIET_WEEK_TO_BUILD",
        "title": "Quiet Week to Build",
        "type": "VERY_GOOD",
        "intensity": 75,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The city looks away long enough for you to breathe.",
      "longText": "The city looks away long enough for you to breathe."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "OPP_025_INHERITANCE_RUMOR",
    "title": "Inheritance Rumor",
    "category": "OPPORTUNITY",
    "severity": "NEUTRAL",
    "tags": [
      "opportunity",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "Older family member/death/fate seed exists.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": "<",
        "value": 45,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "OPP_025_INHERITANCE_RUMOR_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Opportunity +3"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "OPP_025_INHERITANCE_RUMOR_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "OPP_025_INHERITANCE_RUMOR_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "OPP_025_INHERITANCE_RUMOR_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "OPP_025_INHERITANCE_RUMOR_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "OPP_025_INHERITANCE_RUMOR_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A relative mentions a will, then pretends they did not.",
      "longText": "A relative mentions a will, then pretends they did not."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_001_DEBT_COLLECTOR_ARRIVES",
    "title": "Debt Collector Arrives",
    "category": "TROUBLE",
    "severity": "BAD",
    "tags": [
      "trouble",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Player debt exists.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_001_DEBT_COLLECTOR_ARRIVES_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 7,
        "playerVisible": true,
        "displayText": "Stress +7"
      },
      {
        "effectId": "TRO_001_DEBT_COLLECTOR_ARRIVES_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Law heat +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_001_DEBT_COLLECTOR_ARRIVES",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The man at the door is polite. Debt collectors often are, until politeness fails.",
      "longText": "The man at the door is polite. Debt collectors often are, until politeness fails."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_002_WITNESS_APPEARS",
    "title": "Witness Appears",
    "category": "TROUBLE",
    "severity": "VERY_BAD",
    "tags": [
      "trouble",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Violence or heat is high.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_002_WITNESS_APPEARS_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 14,
        "playerVisible": true,
        "displayText": "Stress +14"
      },
      {
        "effectId": "TRO_002_WITNESS_APPEARS_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Law heat +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_TRO_002_WITNESS_APPEARS",
        "title": "Witness Appears",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_002_WITNESS_APPEARS",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Someone saw more than they should have and less than they can survive knowing.",
      "longText": "Someone saw more than they should have and less than they can survive knowing."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_003_POLICE_PATROL_INCREASE",
    "title": "Police Patrol Increase",
    "category": "TROUBLE",
    "severity": "BAD",
    "tags": [
      "trouble",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "District police/heat is high.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_003_POLICE_PATROL_INCREASE_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 7,
        "playerVisible": true,
        "displayText": "Stress +7"
      },
      {
        "effectId": "TRO_003_POLICE_PATROL_INCREASE_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Law heat +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_003_POLICE_PATROL_INCREASE",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Blue uniforms walk the same streets twice. Somebody asked them to.",
      "longText": "Blue uniforms walk the same streets twice. Somebody asked them to."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_004_FAMILY_MEMBER_INSULTED",
    "title": "Family Member Insulted",
    "category": "TROUBLE",
    "severity": "BAD",
    "tags": [
      "trouble",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Family member exists and rival/social tension is high.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_004_FAMILY_MEMBER_INSULTED_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 7,
        "playerVisible": true,
        "displayText": "Stress +7"
      },
      {
        "effectId": "TRO_004_FAMILY_MEMBER_INSULTED_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Law heat +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_004_FAMILY_MEMBER_INSULTED",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "An insult to blood travels faster than one to business.",
      "longText": "An insult to blood travels faster than one to business."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_005_BUSINESS_SHAKEN_DOWN",
    "title": "Business Shaken Down",
    "category": "TROUBLE",
    "severity": "BAD",
    "tags": [
      "trouble",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Business/front exists.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_005_BUSINESS_SHAKEN_DOWN_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 7,
        "playerVisible": true,
        "displayText": "Stress +7"
      },
      {
        "effectId": "TRO_005_BUSINESS_SHAKEN_DOWN_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Law heat +3"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "TRO_005_BUSINESS_SHAKEN_DOWN_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "TRO_005_BUSINESS_SHAKEN_DOWN_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "TRO_005_BUSINESS_SHAKEN_DOWN_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "TRO_005_BUSINESS_SHAKEN_DOWN_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "TRO_005_BUSINESS_SHAKEN_DOWN_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_005_BUSINESS_SHAKEN_DOWN",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Someone else asks your business for protection money. That is not theft. It is a message.",
      "longText": "Someone else asks your business for protection money. That is not theft. It is a message."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_006_BAD_TIP",
    "title": "Bad Tip",
    "category": "TROUBLE",
    "severity": "BAD",
    "tags": [
      "trouble",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Opportunity taken or intel is low.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_006_BAD_TIP_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 7,
        "playerVisible": true,
        "displayText": "Stress +7"
      },
      {
        "effectId": "TRO_006_BAD_TIP_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Law heat +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_006_BAD_TIP",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The tip was not wrong by accident.",
      "longText": "The tip was not wrong by accident."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_007_GAMBLING_LOSS",
    "title": "Gambling Loss",
    "category": "TROUBLE",
    "severity": "BAD",
    "tags": [
      "trouble",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Pleasure/gambling/fate seed active.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_007_GAMBLING_LOSS_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 7,
        "playerVisible": true,
        "displayText": "Stress +7"
      },
      {
        "effectId": "TRO_007_GAMBLING_LOSS_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Law heat +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_007_GAMBLING_LOSS",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Luck spends your money faster than any woman ever could.",
      "longText": "Luck spends your money faster than any woman ever could."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_008_RIVAL_WARNING",
    "title": "Rival Warning",
    "category": "TROUBLE",
    "severity": "NEUTRAL",
    "tags": [
      "trouble",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "Rival pressure exists.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_008_RIVAL_WARNING_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.momentum",
        "operation": "add",
        "value": 2,
        "playerVisible": true,
        "displayText": "Momentum +2"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A message arrives without signature. The handwriting is fear trying to look like confidence.",
      "longText": "A message arrives without signature. The handwriting is fear trying to look like confidence."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_009_SICK_RELATIVE",
    "title": "Sick Relative",
    "category": "TROUBLE",
    "severity": "BAD",
    "tags": [
      "trouble",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Family member exists.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_009_SICK_RELATIVE_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 7,
        "playerVisible": true,
        "displayText": "Stress +7"
      },
      {
        "effectId": "TRO_009_SICK_RELATIVE_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Law heat +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_009_SICK_RELATIVE",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A family member coughs through a smile and tells you not to worry. That is when worry begins.",
      "longText": "A family member coughs through a smile and tells you not to worry. That is when worry begins."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_010_SPOUSE_THREATENED",
    "title": "Spouse Threatened",
    "category": "TROUBLE",
    "severity": "VERY_BAD",
    "tags": [
      "trouble",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Spouse exists and rival/grudge pressure is high.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_010_SPOUSE_THREATENED_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 14,
        "playerVisible": true,
        "displayText": "Stress +14"
      },
      {
        "effectId": "TRO_010_SPOUSE_THREATENED_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Law heat +8"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "TRO_010_SPOUSE_THREATENED_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "TRO_010_SPOUSE_THREATENED_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "TRO_010_SPOUSE_THREATENED_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "TRO_010_SPOUSE_THREATENED_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "TRO_010_SPOUSE_THREATENED_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_TRO_010_SPOUSE_THREATENED",
        "title": "Spouse Threatened",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_010_SPOUSE_THREATENED",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The threat is not sent to you. That is what makes it unforgivable.",
      "longText": "The threat is not sent to you. That is what makes it unforgivable."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_011_CASH_GOES_MISSING",
    "title": "Cash Goes Missing",
    "category": "TROUBLE",
    "severity": "BAD",
    "tags": [
      "trouble",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Cash or dirty cash is positive.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_011_CASH_GOES_MISSING_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 7,
        "playerVisible": true,
        "displayText": "Stress +7"
      },
      {
        "effectId": "TRO_011_CASH_GOES_MISSING_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Law heat +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_011_CASH_GOES_MISSING",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Money disappears from a place only trusted people know about.",
      "longText": "Money disappears from a place only trusted people know about."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_012_INFORMANT_RUMOR",
    "title": "Informant Rumor",
    "category": "TROUBLE",
    "severity": "VERY_BAD",
    "tags": [
      "trouble",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Federal heat or law heat is rising.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_012_INFORMANT_RUMOR_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 14,
        "playerVisible": true,
        "displayText": "Stress +14"
      },
      {
        "effectId": "TRO_012_INFORMANT_RUMOR_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Law heat +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_TRO_012_INFORMANT_RUMOR",
        "title": "Informant Rumor",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_012_INFORMANT_RUMOR",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The word rat does not need proof to poison a room.",
      "longText": "The word rat does not need proof to poison a room."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_013_EXTORTION_BACKFIRES",
    "title": "Extortion Backfires",
    "category": "TROUBLE",
    "severity": "VERY_BAD",
    "tags": [
      "trouble",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Racket active or district order is high.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_013_EXTORTION_BACKFIRES_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 14,
        "playerVisible": true,
        "displayText": "Stress +14"
      },
      {
        "effectId": "TRO_013_EXTORTION_BACKFIRES_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Law heat +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_TRO_013_EXTORTION_BACKFIRES",
        "title": "Extortion Backfires",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_013_EXTORTION_BACKFIRES",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The shopkeeper screams louder than expected, and the neighborhood listens.",
      "longText": "The shopkeeper screams louder than expected, and the neighborhood listens."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_014_CREW_MEMBER_ARRESTED",
    "title": "Crew Member Arrested",
    "category": "TROUBLE",
    "severity": "VERY_BAD",
    "tags": [
      "trouble",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Law heat is high.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_014_CREW_MEMBER_ARRESTED_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 14,
        "playerVisible": true,
        "displayText": "Stress +14"
      },
      {
        "effectId": "TRO_014_CREW_MEMBER_ARRESTED_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Law heat +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_TRO_014_CREW_MEMBER_ARRESTED",
        "title": "Crew Member Arrested",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_014_CREW_MEMBER_ARRESTED",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A crew member disappears into a precinct and comes out only as rumor.",
      "longText": "A crew member disappears into a precinct and comes out only as rumor."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_015_FIRE_AT_A_FRONT",
    "title": "Fire at a Front",
    "category": "TROUBLE",
    "severity": "VERY_BAD",
    "tags": [
      "trouble",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Business/front exists.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_015_FIRE_AT_A_FRONT_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 14,
        "playerVisible": true,
        "displayText": "Stress +14"
      },
      {
        "effectId": "TRO_015_FIRE_AT_A_FRONT_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Law heat +8"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "TRO_015_FIRE_AT_A_FRONT_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "TRO_015_FIRE_AT_A_FRONT_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "TRO_015_FIRE_AT_A_FRONT_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "TRO_015_FIRE_AT_A_FRONT_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "TRO_015_FIRE_AT_A_FRONT_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_TRO_015_FIRE_AT_A_FRONT",
        "title": "Fire at a Front",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_015_FIRE_AT_A_FRONT",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Smoke rises from a place that was supposed to clean money.",
      "longText": "Smoke rises from a place that was supposed to clean money."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_016_BROTHER_IN_TROUBLE",
    "title": "Brother in Trouble",
    "category": "TROUBLE",
    "severity": "BAD",
    "tags": [
      "trouble",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Brother/sibling exists.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_016_BROTHER_IN_TROUBLE_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 7,
        "playerVisible": true,
        "displayText": "Stress +7"
      },
      {
        "effectId": "TRO_016_BROTHER_IN_TROUBLE_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Law heat +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_016_BROTHER_IN_TROUBLE",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Your brother's name is spoken by men who do not speak names kindly.",
      "longText": "Your brother's name is spoken by men who do not speak names kindly."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_017_RIVAL_CREW_SPOTTED",
    "title": "Rival Crew Spotted",
    "category": "TROUBLE",
    "severity": "BAD",
    "tags": [
      "trouble",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "District rival pressure is rising.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_017_RIVAL_CREW_SPOTTED_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 7,
        "playerVisible": true,
        "displayText": "Stress +7"
      },
      {
        "effectId": "TRO_017_RIVAL_CREW_SPOTTED_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Law heat +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_017_RIVAL_CREW_SPOTTED",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A rival crew lingers where they should not know to stand.",
      "longText": "A rival crew lingers where they should not know to stand."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_018_BAD_PRESS",
    "title": "Bad Press",
    "category": "TROUBLE",
    "severity": "BAD",
    "tags": [
      "trouble",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Public attention is high.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_018_BAD_PRESS_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 7,
        "playerVisible": true,
        "displayText": "Stress +7"
      },
      {
        "effectId": "TRO_018_BAD_PRESS_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Law heat +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_018_BAD_PRESS",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The paper does not name you. It does not have to.",
      "longText": "The paper does not name you. It does not have to."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_019_WEAPON_MISFIRE",
    "title": "Weapon Misfire",
    "category": "TROUBLE",
    "severity": "BAD",
    "tags": [
      "trouble",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Violent action or bad fortune.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_019_WEAPON_MISFIRE_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 7,
        "playerVisible": true,
        "displayText": "Stress +7"
      },
      {
        "effectId": "TRO_019_WEAPON_MISFIRE_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Law heat +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_019_WEAPON_MISFIRE",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The gun clicks when it should roar. Everyone hears the difference.",
      "longText": "The gun clicks when it should roar. Everyone hears the difference."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_020_HIDDEN_WARRANT",
    "title": "Hidden Warrant",
    "category": "TROUBLE",
    "severity": "VERY_BAD",
    "tags": [
      "trouble",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Heat is high.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_020_HIDDEN_WARRANT_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 14,
        "playerVisible": true,
        "displayText": "Stress +14"
      },
      {
        "effectId": "TRO_020_HIDDEN_WARRANT_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Law heat +8"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "TRO_020_HIDDEN_WARRANT_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "TRO_020_HIDDEN_WARRANT_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "TRO_020_HIDDEN_WARRANT_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "TRO_020_HIDDEN_WARRANT_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "TRO_020_HIDDEN_WARRANT_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_TRO_020_HIDDEN_WARRANT",
        "title": "Hidden Warrant",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_020_HIDDEN_WARRANT",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A warrant waits in a drawer until someone decides it is useful.",
      "longText": "A warrant waits in a drawer until someone decides it is useful."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_021_LOAN_SHARK_PRESSES_HARD",
    "title": "Loan Shark Presses Hard",
    "category": "TROUBLE",
    "severity": "BAD",
    "tags": [
      "trouble",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Debt exists.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_021_LOAN_SHARK_PRESSES_HARD_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 7,
        "playerVisible": true,
        "displayText": "Stress +7"
      },
      {
        "effectId": "TRO_021_LOAN_SHARK_PRESSES_HARD_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Law heat +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_021_LOAN_SHARK_PRESSES_HARD",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The lender changes his tone. Interest is no longer the worst part of the debt.",
      "longText": "The lender changes his tone. Interest is no longer the worst part of the debt."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_022_FRIEND_TURNS_COLD",
    "title": "Friend Turns Cold",
    "category": "TROUBLE",
    "severity": "BAD",
    "tags": [
      "trouble",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Friend with low trust or rumor exists.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_022_FRIEND_TURNS_COLD_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 7,
        "playerVisible": true,
        "displayText": "Stress +7"
      },
      {
        "effectId": "TRO_022_FRIEND_TURNS_COLD_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Law heat +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_022_FRIEND_TURNS_COLD",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A friend answers late, speaks less, and hangs up first.",
      "longText": "A friend answers late, speaks less, and hangs up first."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_023_A_BODY_SURFACES",
    "title": "A Body Surfaces",
    "category": "TROUBLE",
    "severity": "CATASTROPHIC",
    "tags": [
      "trouble",
      "catastrophic",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 1,
    "cooldownDays": 90,
    "cause": "Violence level high or old murder memory exists.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_023_A_BODY_SURFACES_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 20,
        "playerVisible": true,
        "displayText": "Law heat +20"
      },
      {
        "effectId": "TRO_023_A_BODY_SURFACES_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.federalHeat",
        "operation": "add",
        "value": 12,
        "playerVisible": true,
        "displayText": "Federal heat +12"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_TRO_023_A_BODY_SURFACES",
        "title": "A Body Surfaces",
        "type": "CATASTROPHIC",
        "intensity": 95,
        "decayRate": "permanent",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_023_A_BODY_SURFACES",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The river gives back what the city tried to keep.",
      "longText": "The river gives back what the city tried to keep."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_024_INTERNAL_PANIC",
    "title": "Internal Panic",
    "category": "TROUBLE",
    "severity": "BAD",
    "tags": [
      "trouble",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Recent bad events stacked.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_024_INTERNAL_PANIC_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 7,
        "playerVisible": true,
        "displayText": "Stress +7"
      },
      {
        "effectId": "TRO_024_INTERNAL_PANIC_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Law heat +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_024_INTERNAL_PANIC",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Men start asking questions in corners. Panic does not need facts.",
      "longText": "Men start asking questions in corners. Panic does not need facts."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "TRO_025_BAD_LUCK_STREAK",
    "title": "Bad Luck Streak",
    "category": "TROUBLE",
    "severity": "VERY_BAD",
    "tags": [
      "trouble",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Fortune is very low.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      },
      {
        "type": "variableWeight",
        "variableId": "providence.heat",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      }
    ],
    "immediateEffects": [
      {
        "effectId": "TRO_025_BAD_LUCK_STREAK_E1",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 14,
        "playerVisible": true,
        "displayText": "Stress +14"
      },
      {
        "effectId": "TRO_025_BAD_LUCK_STREAK_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Law heat +8"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "TRO_025_BAD_LUCK_STREAK_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "TRO_025_BAD_LUCK_STREAK_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "TRO_025_BAD_LUCK_STREAK_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "TRO_025_BAD_LUCK_STREAK_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "TRO_025_BAD_LUCK_STREAK_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_TRO_025_BAD_LUCK_STREAK",
        "title": "Bad Luck Streak",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_TRO_025_BAD_LUCK_STREAK",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "For a few days, every door sticks, every favor costs more, and every smile hides teeth.",
      "longText": "For a few days, every door sticks, every favor costs more, and every smile hides teeth."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_001_DOCK_STRIKE",
    "title": "Dock Strike",
    "category": "DISTRICT",
    "severity": "NEUTRAL",
    "tags": [
      "district",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "Dock/industrial district exists.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "DIS_001_DOCK_STRIKE_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.businessActivity",
        "operation": "add",
        "value": 2,
        "playerVisible": true,
        "displayText": "Business activity +2"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The docks stop moving. A city built on cargo suddenly remembers its spine.",
      "longText": "The docks stop moving. A city built on cargo suddenly remembers its spine."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_002_NEW_BUSINESS_OPENS",
    "title": "New Business Opens",
    "category": "DISTRICT",
    "severity": "GOOD",
    "tags": [
      "district",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "District business activity can rise.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "DIS_002_NEW_BUSINESS_OPENS_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.wealth",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "District wealth +4"
      },
      {
        "effectId": "DIS_002_NEW_BUSINESS_OPENS_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Opportunity +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Fresh paint, new windows, nervous owners. Opportunity wears a clean apron.",
      "longText": "Fresh paint, new windows, nervous owners. Opportunity wears a clean apron."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_003_NEIGHBORHOOD_UNREST",
    "title": "Neighborhood Unrest",
    "category": "DISTRICT",
    "severity": "BAD",
    "tags": [
      "district",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Order is low or crime is high.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "DIS_003_NEIGHBORHOOD_UNREST_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.unrest",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Unrest +6"
      },
      {
        "effectId": "DIS_003_NEIGHBORHOOD_UNREST_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.order",
        "operation": "subtract",
        "value": 4,
        "playerVisible": true,
        "displayText": "Order -4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_DIS_003_NEIGHBORHOOD_UNREST",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The neighborhood feels one insult away from breaking glass.",
      "longText": "The neighborhood feels one insult away from breaking glass."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_004_CHURCH_FESTIVAL",
    "title": "Church Festival",
    "category": "DISTRICT",
    "severity": "GOOD",
    "tags": [
      "district",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Stable district or calendar roll.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "DIS_004_CHURCH_FESTIVAL_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.wealth",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "District wealth +4"
      },
      {
        "effectId": "DIS_004_CHURCH_FESTIVAL_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Opportunity +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Lanterns, prayers, and enough crowds to hide a hundred conversations.",
      "longText": "Lanterns, prayers, and enough crowds to hide a hundred conversations."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_005_FACTORY_LAYOFFS",
    "title": "Factory Layoffs",
    "category": "DISTRICT",
    "severity": "BAD",
    "tags": [
      "district",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Industrial/economic slump.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "DIS_005_FACTORY_LAYOFFS_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.unrest",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Unrest +6"
      },
      {
        "effectId": "DIS_005_FACTORY_LAYOFFS_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.order",
        "operation": "subtract",
        "value": 4,
        "playerVisible": true,
        "displayText": "Order -4"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "DIS_005_FACTORY_LAYOFFS_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "DIS_005_FACTORY_LAYOFFS_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "DIS_005_FACTORY_LAYOFFS_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "DIS_005_FACTORY_LAYOFFS_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "DIS_005_FACTORY_LAYOFFS_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_DIS_005_FACTORY_LAYOFFS",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Men leave the factory with lunch pails and no wages.",
      "longText": "Men leave the factory with lunch pails and no wages."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_006_POLICE_PRECINCT_PUSH",
    "title": "Police Precinct Push",
    "category": "DISTRICT",
    "severity": "VERY_BAD",
    "tags": [
      "district",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "District police high or law heat high.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "DIS_006_POLICE_PRECINCT_PUSH_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.police",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Police +8"
      },
      {
        "effectId": "DIS_006_POLICE_PRECINCT_PUSH_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.publicAttention",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Public attention +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_DIS_006_POLICE_PRECINCT_PUSH",
        "title": "Police Precinct Push",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_DIS_006_POLICE_PRECINCT_PUSH",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A precinct captain decides the neighborhood needs cleaning.",
      "longText": "A precinct captain decides the neighborhood needs cleaning."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_007_NEW_TENEMENTS",
    "title": "New Tenements",
    "category": "DISTRICT",
    "severity": "NEUTRAL",
    "tags": [
      "district",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "District growth roll.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "DIS_007_NEW_TENEMENTS_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.businessActivity",
        "operation": "add",
        "value": 2,
        "playerVisible": true,
        "displayText": "Business activity +2"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "New walls rise faster than new hope.",
      "longText": "New walls rise faster than new hope."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_008_MARKET_DAY",
    "title": "Market Day",
    "category": "DISTRICT",
    "severity": "GOOD",
    "tags": [
      "district",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "District business positive.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "DIS_008_MARKET_DAY_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.wealth",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "District wealth +4"
      },
      {
        "effectId": "DIS_008_MARKET_DAY_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Opportunity +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Stalls fill the street. Money changes hands too quickly for all of it to be honest.",
      "longText": "Stalls fill the street. Money changes hands too quickly for all of it to be honest."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_009_RIVAL_GRAFFITI",
    "title": "Rival Graffiti",
    "category": "DISTRICT",
    "severity": "BAD",
    "tags": [
      "district",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Rival pressure exists.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "DIS_009_RIVAL_GRAFFITI_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.unrest",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Unrest +6"
      },
      {
        "effectId": "DIS_009_RIVAL_GRAFFITI_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.order",
        "operation": "subtract",
        "value": 4,
        "playerVisible": true,
        "displayText": "Order -4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_DIS_009_RIVAL_GRAFFITI",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A wall carries another family's mark by morning.",
      "longText": "A wall carries another family's mark by morning."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_010_LOCAL_ELECTION_RALLY",
    "title": "Local Election Rally",
    "category": "DISTRICT",
    "severity": "NEUTRAL",
    "tags": [
      "district",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "Election world seed active.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "DIS_010_LOCAL_ELECTION_RALLY_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.businessActivity",
        "operation": "add",
        "value": 2,
        "playerVisible": true,
        "displayText": "Business activity +2"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "DIS_010_LOCAL_ELECTION_RALLY_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "DIS_010_LOCAL_ELECTION_RALLY_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "DIS_010_LOCAL_ELECTION_RALLY_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "DIS_010_LOCAL_ELECTION_RALLY_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "DIS_010_LOCAL_ELECTION_RALLY_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A candidate promises order to people who pay extra for chaos.",
      "longText": "A candidate promises order to people who pay extra for chaos."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_011_SPEAKEASY_BOOM",
    "title": "Speakeasy Boom",
    "category": "DISTRICT",
    "severity": "GOOD",
    "tags": [
      "district",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Nightlife district or opportunity roll.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "DIS_011_SPEAKEASY_BOOM_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.wealth",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "District wealth +4"
      },
      {
        "effectId": "DIS_011_SPEAKEASY_BOOM_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Opportunity +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Every closed door in the district seems to have music behind it.",
      "longText": "Every closed door in the district seems to have music behind it."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_012_STREET_VIOLENCE",
    "title": "Street Violence",
    "category": "DISTRICT",
    "severity": "VERY_BAD",
    "tags": [
      "district",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Violence is high.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "DIS_012_STREET_VIOLENCE_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.police",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Police +8"
      },
      {
        "effectId": "DIS_012_STREET_VIOLENCE_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.publicAttention",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Public attention +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_DIS_012_STREET_VIOLENCE",
        "title": "Street Violence",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_DIS_012_STREET_VIOLENCE",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A fight spills across three storefronts and leaves the street quiet for the wrong reason.",
      "longText": "A fight spills across three storefronts and leaves the street quiet for the wrong reason."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_013_QUIET_PATROL_GAP",
    "title": "Quiet Patrol Gap",
    "category": "DISTRICT",
    "severity": "GOOD",
    "tags": [
      "district",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Fortune positive or corruption strength high.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "DIS_013_QUIET_PATROL_GAP_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.wealth",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "District wealth +4"
      },
      {
        "effectId": "DIS_013_QUIET_PATROL_GAP_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Opportunity +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "For two nights, patrol routes forget a street.",
      "longText": "For two nights, patrol routes forget a street."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_014_NEW_CONSTRUCTION_CONTRACT",
    "title": "New Construction Contract",
    "category": "DISTRICT",
    "severity": "VERY_GOOD",
    "tags": [
      "district",
      "very_good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 40,
    "cause": "District wealth/business rising.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "DIS_014_NEW_CONSTRUCTION_CONTRACT_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.wealth",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Wealth +8"
      },
      {
        "effectId": "DIS_014_NEW_CONSTRUCTION_CONTRACT_E2",
        "type": "modifyVariable",
        "targetResolver": "business",
        "variableId": "business.monthlyIncome",
        "operation": "add",
        "value": 800,
        "playerVisible": true,
        "displayText": "Business income +800"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_DIS_014_NEW_CONSTRUCTION_CONTRACT",
        "title": "New Construction Contract",
        "type": "VERY_GOOD",
        "intensity": 75,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A construction contract appears with enough concrete to bury problems in.",
      "longText": "A construction contract appears with enough concrete to bury problems in."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_015_SCHOOL_SCANDAL",
    "title": "School Scandal",
    "category": "DISTRICT",
    "severity": "NEUTRAL",
    "tags": [
      "district",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "District public attention random roll.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "DIS_015_SCHOOL_SCANDAL_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.businessActivity",
        "operation": "add",
        "value": 2,
        "playerVisible": true,
        "displayText": "Business activity +2"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "DIS_015_SCHOOL_SCANDAL_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "DIS_015_SCHOOL_SCANDAL_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "DIS_015_SCHOOL_SCANDAL_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "DIS_015_SCHOOL_SCANDAL_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "DIS_015_SCHOOL_SCANDAL_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A school scandal gives every gossip in the district something safer to discuss.",
      "longText": "A school scandal gives every gossip in the district something safer to discuss."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_016_FLOODED_STREETS",
    "title": "Flooded Streets",
    "category": "DISTRICT",
    "severity": "BAD",
    "tags": [
      "district",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "World weather roll.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "DIS_016_FLOODED_STREETS_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.unrest",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Unrest +6"
      },
      {
        "effectId": "DIS_016_FLOODED_STREETS_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.order",
        "operation": "subtract",
        "value": 4,
        "playerVisible": true,
        "displayText": "Order -4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_DIS_016_FLOODED_STREETS",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Rain turns alleys into black mirrors and businesses into buckets.",
      "longText": "Rain turns alleys into black mirrors and businesses into buckets."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_017_DOCK_INSPECTOR_BRIBED",
    "title": "Dock Inspector Bribed",
    "category": "DISTRICT",
    "severity": "GOOD",
    "tags": [
      "district",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Corruption strength exists.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "DIS_017_DOCK_INSPECTOR_BRIBED_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.wealth",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "District wealth +4"
      },
      {
        "effectId": "DIS_017_DOCK_INSPECTOR_BRIBED_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Opportunity +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "An inspector learns the financial value of poor eyesight.",
      "longText": "An inspector learns the financial value of poor eyesight."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_018_NEIGHBORHOOD_HERO",
    "title": "Neighborhood Hero",
    "category": "DISTRICT",
    "severity": "NEUTRAL",
    "tags": [
      "district",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "District public legitimacy matters.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "DIS_018_NEIGHBORHOOD_HERO_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.businessActivity",
        "operation": "add",
        "value": 2,
        "playerVisible": true,
        "displayText": "Business activity +2"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A local do-gooder starts asking why everyone is afraid.",
      "longText": "A local do-gooder starts asking why everyone is afraid."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_019_STREET_MARKET_FIRE",
    "title": "Street Market Fire",
    "category": "DISTRICT",
    "severity": "VERY_BAD",
    "tags": [
      "district",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Bad fortune or trouble roll.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "DIS_019_STREET_MARKET_FIRE_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.police",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Police +8"
      },
      {
        "effectId": "DIS_019_STREET_MARKET_FIRE_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.publicAttention",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Public attention +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_DIS_019_STREET_MARKET_FIRE",
        "title": "Street Market Fire",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_DIS_019_STREET_MARKET_FIRE",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The market burns fast. Blame burns faster.",
      "longText": "The market burns fast. Blame burns faster."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_020_IMMIGRANT_WAVE",
    "title": "Immigrant Wave",
    "category": "DISTRICT",
    "severity": "NEUTRAL",
    "tags": [
      "district",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "World/district growth.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "DIS_020_IMMIGRANT_WAVE_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.businessActivity",
        "operation": "add",
        "value": 2,
        "playerVisible": true,
        "displayText": "Business activity +2"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "DIS_020_IMMIGRANT_WAVE_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "DIS_020_IMMIGRANT_WAVE_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "DIS_020_IMMIGRANT_WAVE_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "DIS_020_IMMIGRANT_WAVE_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "DIS_020_IMMIGRANT_WAVE_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "New families arrive carrying names the city will learn to mispronounce.",
      "longText": "New families arrive carrying names the city will learn to mispronounce."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_021_UNION_ELECTION",
    "title": "Union Election",
    "category": "DISTRICT",
    "severity": "CRITICAL",
    "tags": [
      "district",
      "critical",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 2,
    "cooldownDays": 60,
    "cause": "Labor district and corruption/wealth active.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.momentum",
        "operator": "<",
        "value": 30,
        "weightAdd": 5
      }
    ],
    "immediateEffects": [
      {
        "effectId": "DIS_021_UNION_ELECTION_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.control",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Control +4"
      },
      {
        "effectId": "DIS_021_UNION_ELECTION_E2",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.momentum",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Momentum +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_DIS_021_UNION_ELECTION",
        "title": "Union Election",
        "type": "CRITICAL",
        "intensity": 85,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_DIS_021_UNION_ELECTION",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "One union vote may decide who eats, who works, and who pays tribute.",
      "longText": "One union vote may decide who eats, who works, and who pays tribute."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_022_RIVAL_SAFEHOUSE_FOUND",
    "title": "Rival Safehouse Found",
    "category": "DISTRICT",
    "severity": "VERY_GOOD",
    "tags": [
      "district",
      "very_good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 40,
    "cause": "Rival pressure high.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "DIS_022_RIVAL_SAFEHOUSE_FOUND_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.wealth",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Wealth +8"
      },
      {
        "effectId": "DIS_022_RIVAL_SAFEHOUSE_FOUND_E2",
        "type": "modifyVariable",
        "targetResolver": "business",
        "variableId": "business.monthlyIncome",
        "operation": "add",
        "value": 800,
        "playerVisible": true,
        "displayText": "Business income +800"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_DIS_022_RIVAL_SAFEHOUSE_FOUND",
        "title": "Rival Safehouse Found",
        "type": "VERY_GOOD",
        "intensity": 75,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A rival safehouse is found because one man trusted the wrong hallway.",
      "longText": "A rival safehouse is found because one man trusted the wrong hallway."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_023_PUBLIC_CRACKDOWN",
    "title": "Public Crackdown",
    "category": "DISTRICT",
    "severity": "VERY_BAD",
    "tags": [
      "district",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Public attention high.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "DIS_023_PUBLIC_CRACKDOWN_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.police",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Police +8"
      },
      {
        "effectId": "DIS_023_PUBLIC_CRACKDOWN_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.publicAttention",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Public attention +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_DIS_023_PUBLIC_CRACKDOWN",
        "title": "Public Crackdown",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_DIS_023_PUBLIC_CRACKDOWN",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The city wants a performance, and the police know their lines.",
      "longText": "The city wants a performance, and the police know their lines."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_024_BLOCK_CAPTAIN_BOUGHT",
    "title": "Block Captain Bought",
    "category": "DISTRICT",
    "severity": "GOOD",
    "tags": [
      "district",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Corruption strength active.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "DIS_024_BLOCK_CAPTAIN_BOUGHT_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.wealth",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "District wealth +4"
      },
      {
        "effectId": "DIS_024_BLOCK_CAPTAIN_BOUGHT_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.opportunity",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Opportunity +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A neighborhood captain learns loyalty pays better than honesty.",
      "longText": "A neighborhood captain learns loyalty pays better than honesty."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "DIS_025_DISTRICT_POWER_VACUUM",
    "title": "District Power Vacuum",
    "category": "DISTRICT",
    "severity": "CRITICAL",
    "tags": [
      "district",
      "critical",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 2,
    "cooldownDays": 60,
    "cause": "Rival hit, capo death, or low control.",
    "requirements": [
      {
        "type": "districtExists",
        "targetResolver": "random district",
        "operator": "exists",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.momentum",
        "operator": "<",
        "value": 30,
        "weightAdd": 5
      }
    ],
    "immediateEffects": [
      {
        "effectId": "DIS_025_DISTRICT_POWER_VACUUM_E1",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.control",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Control +4"
      },
      {
        "effectId": "DIS_025_DISTRICT_POWER_VACUUM_E2",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.momentum",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Momentum +8"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "DIS_025_DISTRICT_POWER_VACUUM_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "DIS_025_DISTRICT_POWER_VACUUM_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "DIS_025_DISTRICT_POWER_VACUUM_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "DIS_025_DISTRICT_POWER_VACUUM_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "DIS_025_DISTRICT_POWER_VACUUM_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_DIS_025_DISTRICT_POWER_VACUUM",
        "title": "District Power Vacuum",
        "type": "CRITICAL",
        "intensity": 85,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_DIS_025_DISTRICT_POWER_VACUUM",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "For one week, nobody knows who owns the street. That never lasts.",
      "longText": "For one week, nobody knows who owns the street. That never lasts."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_001_ELECTION_SEASON",
    "title": "Election Season",
    "category": "WORLD",
    "severity": "NEUTRAL",
    "tags": [
      "world",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "Calendar/world roll.",
    "requirements": [],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "WOR_001_ELECTION_SEASON_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.momentum",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Momentum +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Every honest man suddenly needs money and every criminal suddenly has access.",
      "longText": "Every honest man suddenly needs money and every criminal suddenly has access."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_002_CRACKDOWN_RUMORS",
    "title": "Crackdown Rumors",
    "category": "WORLD",
    "severity": "BAD",
    "tags": [
      "world",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Heat or violence rising.",
    "requirements": [],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "WOR_002_CRACKDOWN_RUMORS_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Law heat +5"
      },
      {
        "effectId": "WOR_002_CRACKDOWN_RUMORS_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.wealth",
        "operation": "subtract",
        "value": 3,
        "playerVisible": true,
        "displayText": "District wealth -3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_WOR_002_CRACKDOWN_RUMORS",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The word crackdown moves through the city before the warrants do.",
      "longText": "The word crackdown moves through the city before the warrants do."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_003_MARKET_SLUMP",
    "title": "Market Slump",
    "category": "WORLD",
    "severity": "BAD",
    "tags": [
      "world",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Economic world roll.",
    "requirements": [],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "WOR_003_MARKET_SLUMP_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Law heat +5"
      },
      {
        "effectId": "WOR_003_MARKET_SLUMP_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.wealth",
        "operation": "subtract",
        "value": 3,
        "playerVisible": true,
        "displayText": "District wealth -3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_WOR_003_MARKET_SLUMP",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Money tightens across the city. Men who used to pay now negotiate.",
      "longText": "Money tightens across the city. Men who used to pay now negotiate."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_004_RAIN_WEEK",
    "title": "Rain Week",
    "category": "WORLD",
    "severity": "NEUTRAL",
    "tags": [
      "world",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "Weather roll.",
    "requirements": [],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "WOR_004_RAIN_WEEK_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.momentum",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Momentum +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Rain washes blood, slows trucks, and gives every liar an excuse for being late.",
      "longText": "Rain washes blood, slows trucks, and gives every liar an excuse for being late."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_005_HEAT_WAVE",
    "title": "Heat Wave",
    "category": "WORLD",
    "severity": "BAD",
    "tags": [
      "world",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Weather roll.",
    "requirements": [],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "WOR_005_HEAT_WAVE_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Law heat +5"
      },
      {
        "effectId": "WOR_005_HEAT_WAVE_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.wealth",
        "operation": "subtract",
        "value": 3,
        "playerVisible": true,
        "displayText": "District wealth -3"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "WOR_005_HEAT_WAVE_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "WOR_005_HEAT_WAVE_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "WOR_005_HEAT_WAVE_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "WOR_005_HEAT_WAVE_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "WOR_005_HEAT_WAVE_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_WOR_005_HEAT_WAVE",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The heat makes tempers cheap and sleep expensive.",
      "longText": "The heat makes tempers cheap and sleep expensive."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_006_NEW_POLICE_COMMISSIONER",
    "title": "New Police Commissioner",
    "category": "WORLD",
    "severity": "CRITICAL",
    "tags": [
      "world",
      "critical",
      "starter-pack"
    ],
    "unique": true,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 2,
    "cooldownDays": 60,
    "cause": "World politics roll.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.momentum",
        "operator": "<",
        "value": 30,
        "weightAdd": 5
      }
    ],
    "immediateEffects": [
      {
        "effectId": "WOR_006_NEW_POLICE_COMMISSIONER_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.momentum",
        "operation": "add",
        "value": 12,
        "playerVisible": true,
        "displayText": "Momentum +12"
      },
      {
        "effectId": "WOR_006_NEW_POLICE_COMMISSIONER_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.corruptionStrength",
        "operation": "add",
        "value": 2,
        "playerVisible": true,
        "displayText": "Corruption strength +2"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_WOR_006_NEW_POLICE_COMMISSIONER",
        "title": "New Police Commissioner",
        "type": "CRITICAL",
        "intensity": 85,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_WOR_006_NEW_POLICE_COMMISSIONER",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A new commissioner promises order. Men like that always need examples.",
      "longText": "A new commissioner promises order. Men like that always need examples."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_007_FRIENDLY_JUDGE_RETIRES",
    "title": "Friendly Judge Retires",
    "category": "WORLD",
    "severity": "VERY_BAD",
    "tags": [
      "world",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Corruption network exists.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "WOR_007_FRIENDLY_JUDGE_RETIRES_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.federalHeat",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Federal heat +8"
      },
      {
        "effectId": "WOR_007_FRIENDLY_JUDGE_RETIRES_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.publicLegitimacy",
        "operation": "subtract",
        "value": 5,
        "playerVisible": true,
        "displayText": "Public legitimacy -5"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_WOR_007_FRIENDLY_JUDGE_RETIRES",
        "title": "Friendly Judge Retires",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_WOR_007_FRIENDLY_JUDGE_RETIRES",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A friendly judge retires, taking years of useful blindness with him.",
      "longText": "A friendly judge retires, taking years of useful blindness with him."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_008_BANK_TIGHTENS_LOANS",
    "title": "Bank Tightens Loans",
    "category": "WORLD",
    "severity": "BAD",
    "tags": [
      "world",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Businesses/debt exist.",
    "requirements": [],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "WOR_008_BANK_TIGHTENS_LOANS_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Law heat +5"
      },
      {
        "effectId": "WOR_008_BANK_TIGHTENS_LOANS_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.wealth",
        "operation": "subtract",
        "value": 3,
        "playerVisible": true,
        "displayText": "District wealth -3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_WOR_008_BANK_TIGHTENS_LOANS",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The banks discover caution just when everyone needs cash.",
      "longText": "The banks discover caution just when everyone needs cash."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_009_DOCK_BOOM",
    "title": "Dock Boom",
    "category": "WORLD",
    "severity": "GOOD",
    "tags": [
      "world",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Docks/commerce world roll.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "WOR_009_DOCK_BOOM_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.corruptionStrength",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Corruption strength +3"
      },
      {
        "effectId": "WOR_009_DOCK_BOOM_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.wealth",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "District wealth +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Ships arrive heavy. Work arrives dirty. Money arrives nervous.",
      "longText": "Ships arrive heavy. Work arrives dirty. Money arrives nervous."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_010_MORAL_PANIC",
    "title": "Moral Panic",
    "category": "WORLD",
    "severity": "VERY_BAD",
    "tags": [
      "world",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Violence/public attention high.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "WOR_010_MORAL_PANIC_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.federalHeat",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Federal heat +8"
      },
      {
        "effectId": "WOR_010_MORAL_PANIC_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.publicLegitimacy",
        "operation": "subtract",
        "value": 5,
        "playerVisible": true,
        "displayText": "Public legitimacy -5"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "WOR_010_MORAL_PANIC_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "WOR_010_MORAL_PANIC_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "WOR_010_MORAL_PANIC_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "WOR_010_MORAL_PANIC_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "WOR_010_MORAL_PANIC_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_WOR_010_MORAL_PANIC",
        "title": "Moral Panic",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_WOR_010_MORAL_PANIC",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The newspapers learn a new word for sin and print it in large type.",
      "longText": "The newspapers learn a new word for sin and print it in large type."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_011_CHARITY_SEASON",
    "title": "Charity Season",
    "category": "WORLD",
    "severity": "GOOD",
    "tags": [
      "world",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Calendar roll.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "WOR_011_CHARITY_SEASON_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.corruptionStrength",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Corruption strength +3"
      },
      {
        "effectId": "WOR_011_CHARITY_SEASON_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.wealth",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "District wealth +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The city forgives many things when envelopes reach the right church.",
      "longText": "The city forgives many things when envelopes reach the right church."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_012_FEDERAL_ATTENTION_SHIFTS",
    "title": "Federal Attention Shifts",
    "category": "WORLD",
    "severity": "GOOD",
    "tags": [
      "world",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Fortune positive or player struggling.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "WOR_012_FEDERAL_ATTENTION_SHIFTS_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.corruptionStrength",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Corruption strength +3"
      },
      {
        "effectId": "WOR_012_FEDERAL_ATTENTION_SHIFTS_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.wealth",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "District wealth +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "For once, federal eyes turn toward someone else's mess.",
      "longText": "For once, federal eyes turn toward someone else's mess."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_013_NATIONAL_CRIME_STORY",
    "title": "National Crime Story",
    "category": "WORLD",
    "severity": "BAD",
    "tags": [
      "world",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Public attention/violence high.",
    "requirements": [],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "WOR_013_NATIONAL_CRIME_STORY_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Law heat +5"
      },
      {
        "effectId": "WOR_013_NATIONAL_CRIME_STORY_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.wealth",
        "operation": "subtract",
        "value": 3,
        "playerVisible": true,
        "displayText": "District wealth -3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_WOR_013_NATIONAL_CRIME_STORY",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A story from another city gives local police ambition.",
      "longText": "A story from another city gives local police ambition."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_014_HARSH_WINTER",
    "title": "Harsh Winter",
    "category": "WORLD",
    "severity": "BAD",
    "tags": [
      "world",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Season roll.",
    "requirements": [],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "WOR_014_HARSH_WINTER_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Law heat +5"
      },
      {
        "effectId": "WOR_014_HARSH_WINTER_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.wealth",
        "operation": "subtract",
        "value": 3,
        "playerVisible": true,
        "displayText": "District wealth -3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_WOR_014_HARSH_WINTER",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Cold makes honest work scarce and dishonest work desperate.",
      "longText": "Cold makes honest work scarce and dishonest work desperate."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_015_CITY_FESTIVAL",
    "title": "City Festival",
    "category": "WORLD",
    "severity": "GOOD",
    "tags": [
      "world",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Calendar roll.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "WOR_015_CITY_FESTIVAL_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.corruptionStrength",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Corruption strength +3"
      },
      {
        "effectId": "WOR_015_CITY_FESTIVAL_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.wealth",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "District wealth +3"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "WOR_015_CITY_FESTIVAL_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "WOR_015_CITY_FESTIVAL_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "WOR_015_CITY_FESTIVAL_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "WOR_015_CITY_FESTIVAL_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "WOR_015_CITY_FESTIVAL_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Crowds fill the streets. So do pockets, lies, and opportunities.",
      "longText": "Crowds fill the streets. So do pockets, lies, and opportunities."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_016_NEW_RIVAL_FAMILY_ARRIVES",
    "title": "New Rival Family Arrives",
    "category": "WORLD",
    "severity": "CRITICAL",
    "tags": [
      "world",
      "critical",
      "starter-pack"
    ],
    "unique": true,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 2,
    "cooldownDays": 60,
    "cause": "Midgame/world expansion roll.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.momentum",
        "operator": "<",
        "value": 30,
        "weightAdd": 5
      }
    ],
    "immediateEffects": [
      {
        "effectId": "WOR_016_NEW_RIVAL_FAMILY_ARRIVES_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.momentum",
        "operation": "add",
        "value": 12,
        "playerVisible": true,
        "displayText": "Momentum +12"
      },
      {
        "effectId": "WOR_016_NEW_RIVAL_FAMILY_ARRIVES_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.corruptionStrength",
        "operation": "add",
        "value": 2,
        "playerVisible": true,
        "displayText": "Corruption strength +2"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_WOR_016_NEW_RIVAL_FAMILY_ARRIVES",
        "title": "New Rival Family Arrives",
        "type": "CRITICAL",
        "intensity": 85,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_WOR_016_NEW_RIVAL_FAMILY_ARRIVES",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "New men come to the city with old habits and fresh graves behind them.",
      "longText": "New men come to the city with old habits and fresh graves behind them."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_017_PROHIBITION_PRESSURE",
    "title": "Prohibition Pressure",
    "category": "WORLD",
    "severity": "BAD",
    "tags": [
      "world",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Vice rackets active.",
    "requirements": [],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "WOR_017_PROHIBITION_PRESSURE_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Law heat +5"
      },
      {
        "effectId": "WOR_017_PROHIBITION_PRESSURE_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.wealth",
        "operation": "subtract",
        "value": 3,
        "playerVisible": true,
        "displayText": "District wealth -3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_WOR_017_PROHIBITION_PRESSURE",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The law remembers alcohol exists whenever it needs arrests.",
      "longText": "The law remembers alcohol exists whenever it needs arrests."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_018_CONSTRUCTION_BOOM",
    "title": "Construction Boom",
    "category": "WORLD",
    "severity": "VERY_GOOD",
    "tags": [
      "world",
      "very_good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 40,
    "cause": "Business/district growth roll.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "WOR_018_CONSTRUCTION_BOOM_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.corruptionStrength",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Corruption strength +6"
      },
      {
        "effectId": "WOR_018_CONSTRUCTION_BOOM_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "subtract",
        "value": 4,
        "playerVisible": true,
        "displayText": "Law heat -4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_WOR_018_CONSTRUCTION_BOOM",
        "title": "Construction Boom",
        "type": "VERY_GOOD",
        "intensity": 75,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The city grows upward. Every beam needs permission. Every permission has a price.",
      "longText": "The city grows upward. Every beam needs permission. Every permission has a price."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_019_NEWSPAPER_WAR",
    "title": "Newspaper War",
    "category": "WORLD",
    "severity": "NEUTRAL",
    "tags": [
      "world",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "Election/public roll.",
    "requirements": [],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "WOR_019_NEWSPAPER_WAR_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.momentum",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Momentum +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Two papers fight over truth, which means truth is negotiable.",
      "longText": "Two papers fight over truth, which means truth is negotiable."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_020_POLICE_BUDGET_CUT",
    "title": "Police Budget Cut",
    "category": "WORLD",
    "severity": "VERY_GOOD",
    "tags": [
      "world",
      "very_good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 40,
    "cause": "Fortune/prosperity roll.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "WOR_020_POLICE_BUDGET_CUT_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.corruptionStrength",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Corruption strength +6"
      },
      {
        "effectId": "WOR_020_POLICE_BUDGET_CUT_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "subtract",
        "value": 4,
        "playerVisible": true,
        "displayText": "Law heat -4"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "WOR_020_POLICE_BUDGET_CUT_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "WOR_020_POLICE_BUDGET_CUT_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "WOR_020_POLICE_BUDGET_CUT_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "WOR_020_POLICE_BUDGET_CUT_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "WOR_020_POLICE_BUDGET_CUT_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_WOR_020_POLICE_BUDGET_CUT",
        "title": "Police Budget Cut",
        "type": "VERY_GOOD",
        "intensity": 75,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The city saves money by looking away.",
      "longText": "The city saves money by looking away."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_021_WAR_OVERSEAS_RUMOR",
    "title": "War Overseas Rumor",
    "category": "WORLD",
    "severity": "NEUTRAL",
    "tags": [
      "world",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "World tension roll.",
    "requirements": [],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "WOR_021_WAR_OVERSEAS_RUMOR_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.momentum",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Momentum +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Men argue about distant wars while local ones wait politely.",
      "longText": "Men argue about distant wars while local ones wait politely."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_022_BANKER_SCANDAL",
    "title": "Banker Scandal",
    "category": "WORLD",
    "severity": "GOOD",
    "tags": [
      "world",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "World/politics roll.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "WOR_022_BANKER_SCANDAL_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.corruptionStrength",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Corruption strength +3"
      },
      {
        "effectId": "WOR_022_BANKER_SCANDAL_E2",
        "type": "modifyVariable",
        "targetResolver": "district",
        "variableId": "district.wealth",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "District wealth +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A banker falls from respectability and starts needing friends without morals.",
      "longText": "A banker falls from respectability and starts needing friends without morals."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_023_INFLUENZA_WAVE",
    "title": "Influenza Wave",
    "category": "WORLD",
    "severity": "VERY_BAD",
    "tags": [
      "world",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Rare world health roll.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "WOR_023_INFLUENZA_WAVE_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.federalHeat",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Federal heat +8"
      },
      {
        "effectId": "WOR_023_INFLUENZA_WAVE_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.publicLegitimacy",
        "operation": "subtract",
        "value": 5,
        "playerVisible": true,
        "displayText": "Public legitimacy -5"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_WOR_023_INFLUENZA_WAVE",
        "title": "Influenza Wave",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_WOR_023_INFLUENZA_WAVE",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The city coughs into handkerchiefs and hides fear behind closed doors.",
      "longText": "The city coughs into handkerchiefs and hides fear behind closed doors."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_024_MAYOR_NEEDS_MONEY",
    "title": "Mayor Needs Money",
    "category": "WORLD",
    "severity": "VERY_GOOD",
    "tags": [
      "world",
      "very_good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 40,
    "cause": "Election season and player cash/prosperity high.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "WOR_024_MAYOR_NEEDS_MONEY_E1",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.corruptionStrength",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Corruption strength +6"
      },
      {
        "effectId": "WOR_024_MAYOR_NEEDS_MONEY_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "subtract",
        "value": 4,
        "playerVisible": true,
        "displayText": "Law heat -4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_WOR_024_MAYOR_NEEDS_MONEY",
        "title": "Mayor Needs Money",
        "type": "VERY_GOOD",
        "intensity": 75,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The mayor's people do not ask for bribes. They ask for support.",
      "longText": "The mayor's people do not ask for bribes. They ask for support."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "WOR_025_CITYWIDE_BLACKOUT",
    "title": "Citywide Blackout",
    "category": "WORLD",
    "severity": "CRITICAL",
    "tags": [
      "world",
      "critical",
      "starter-pack"
    ],
    "unique": true,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 2,
    "cooldownDays": 60,
    "cause": "Rare world event.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.momentum",
        "operator": "<",
        "value": 30,
        "weightAdd": 5
      }
    ],
    "immediateEffects": [
      {
        "effectId": "WOR_025_CITYWIDE_BLACKOUT_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.momentum",
        "operation": "add",
        "value": 12,
        "playerVisible": true,
        "displayText": "Momentum +12"
      },
      {
        "effectId": "WOR_025_CITYWIDE_BLACKOUT_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.corruptionStrength",
        "operation": "add",
        "value": 2,
        "playerVisible": true,
        "displayText": "Corruption strength +2"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "WOR_025_CITYWIDE_BLACKOUT_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "WOR_025_CITYWIDE_BLACKOUT_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "WOR_025_CITYWIDE_BLACKOUT_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "WOR_025_CITYWIDE_BLACKOUT_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "WOR_025_CITYWIDE_BLACKOUT_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_WOR_025_CITYWIDE_BLACKOUT",
        "title": "Citywide Blackout",
        "type": "CRITICAL",
        "intensity": 85,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_WOR_025_CITYWIDE_BLACKOUT",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The lights go out and the city becomes honest about what it is.",
      "longText": "The lights go out and the city becomes honest about what it is."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_001_SUDDEN_INHERITANCE",
    "title": "Sudden Inheritance",
    "category": "FATE",
    "severity": "VERY_GOOD",
    "tags": [
      "fate",
      "very_good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 40,
    "cause": "Rare good fortune or family death seed.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FAT_001_SUDDEN_INHERITANCE_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.fortune",
        "operation": "add",
        "value": 10,
        "playerVisible": true,
        "displayText": "Fortune +10"
      },
      {
        "effectId": "FAT_001_SUDDEN_INHERITANCE_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.cash",
        "operation": "add",
        "value": 2500,
        "playerVisible": true,
        "displayText": "Cash +2500"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FAT_001_SUDDEN_INHERITANCE",
        "title": "Sudden Inheritance",
        "type": "VERY_GOOD",
        "intensity": 75,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A letter arrives with a dead man's signature and living consequences.",
      "longText": "A letter arrives with a dead man's signature and living consequences."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_002_WITNESS_DISAPPEARS",
    "title": "Witness Disappears",
    "category": "FATE",
    "severity": "VERY_GOOD",
    "tags": [
      "fate",
      "very_good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 40,
    "cause": "Witness/trouble seed active.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FAT_002_WITNESS_DISAPPEARS_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.fortune",
        "operation": "add",
        "value": 10,
        "playerVisible": true,
        "displayText": "Fortune +10"
      },
      {
        "effectId": "FAT_002_WITNESS_DISAPPEARS_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.cash",
        "operation": "add",
        "value": 2500,
        "playerVisible": true,
        "displayText": "Cash +2500"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FAT_002_WITNESS_DISAPPEARS",
        "title": "Witness Disappears",
        "type": "VERY_GOOD",
        "intensity": 75,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The witness vanishes before anyone can decide whether to call it mercy.",
      "longText": "The witness vanishes before anyone can decide whether to call it mercy."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_003_LUCKY_ESCAPE",
    "title": "Lucky Escape",
    "category": "FATE",
    "severity": "GOOD",
    "tags": [
      "fate",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Danger/failed job check.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FAT_003_LUCKY_ESCAPE_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.fortune",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Fortune +5"
      },
      {
        "effectId": "FAT_003_LUCKY_ESCAPE_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.cash",
        "operation": "add",
        "value": 600,
        "playerVisible": true,
        "displayText": "Cash +600"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A bullet finds fabric instead of flesh.",
      "longText": "A bullet finds fabric instead of flesh."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_004_RANDOM_DEATH",
    "title": "Random Death",
    "category": "FATE",
    "severity": "CATASTROPHIC",
    "tags": [
      "fate",
      "catastrophic",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 1,
    "cooldownDays": 90,
    "cause": "Very rare fate roll, character eligible.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FAT_004_RANDOM_DEATH_E1",
        "type": "modifyVariable",
        "targetResolver": "random character",
        "variableId": "character.isDead",
        "operation": "setTrue",
        "value": true,
        "playerVisible": true,
        "displayText": "Random character dead"
      },
      {
        "effectId": "FAT_004_RANDOM_DEATH_E2",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.momentum",
        "operation": "add",
        "value": 15,
        "playerVisible": true,
        "displayText": "Momentum +15"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FAT_004_RANDOM_DEATH",
        "title": "Random Death",
        "type": "CATASTROPHIC",
        "intensity": 95,
        "decayRate": "permanent",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_FAT_004_RANDOM_DEATH",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Some deaths arrive without drama. That makes them harder to bargain with.",
      "longText": "Some deaths arrive without drama. That makes them harder to bargain with."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_005_FOUND_ENVELOPE",
    "title": "Found Envelope",
    "category": "FATE",
    "severity": "GOOD",
    "tags": [
      "fate",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Good fortune roll.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FAT_005_FOUND_ENVELOPE_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.fortune",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Fortune +5"
      },
      {
        "effectId": "FAT_005_FOUND_ENVELOPE_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.cash",
        "operation": "add",
        "value": 600,
        "playerVisible": true,
        "displayText": "Cash +600"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FAT_005_FOUND_ENVELOPE_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "FAT_005_FOUND_ENVELOPE_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FAT_005_FOUND_ENVELOPE_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "FAT_005_FOUND_ENVELOPE_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FAT_005_FOUND_ENVELOPE_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "An envelope waits where no envelope should be.",
      "longText": "An envelope waits where no envelope should be."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_006_CURSED_WEEK",
    "title": "Cursed Week",
    "category": "FATE",
    "severity": "VERY_BAD",
    "tags": [
      "fate",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Fortune low.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FAT_006_CURSED_WEEK_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.fortune",
        "operation": "subtract",
        "value": 10,
        "playerVisible": true,
        "displayText": "Fortune -10"
      },
      {
        "effectId": "FAT_006_CURSED_WEEK_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Law heat +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FAT_006_CURSED_WEEK",
        "title": "Cursed Week",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_FAT_006_CURSED_WEEK",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "For seven days the city mispronounces your name as a threat.",
      "longText": "For seven days the city mispronounces your name as a threat."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_007_BLESSED_WEEK",
    "title": "Blessed Week",
    "category": "FATE",
    "severity": "VERY_GOOD",
    "tags": [
      "fate",
      "very_good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 40,
    "cause": "Player collapsing or fortune recovery.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FAT_007_BLESSED_WEEK_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.fortune",
        "operation": "add",
        "value": 10,
        "playerVisible": true,
        "displayText": "Fortune +10"
      },
      {
        "effectId": "FAT_007_BLESSED_WEEK_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.cash",
        "operation": "add",
        "value": 2500,
        "playerVisible": true,
        "displayText": "Cash +2500"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FAT_007_BLESSED_WEEK",
        "title": "Blessed Week",
        "type": "VERY_GOOD",
        "intensity": 75,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "For seven days, doors open before you knock.",
      "longText": "For seven days, doors open before you knock."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_008_LOST_EVIDENCE",
    "title": "Lost Evidence",
    "category": "FATE",
    "severity": "VERY_GOOD",
    "tags": [
      "fate",
      "very_good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 40,
    "cause": "Law heat high and corruption/fate roll.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FAT_008_LOST_EVIDENCE_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.fortune",
        "operation": "add",
        "value": 10,
        "playerVisible": true,
        "displayText": "Fortune +10"
      },
      {
        "effectId": "FAT_008_LOST_EVIDENCE_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.cash",
        "operation": "add",
        "value": 2500,
        "playerVisible": true,
        "displayText": "Cash +2500"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FAT_008_LOST_EVIDENCE",
        "title": "Lost Evidence",
        "type": "VERY_GOOD",
        "intensity": 75,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A file is misplaced, which is sometimes another word for saved.",
      "longText": "A file is misplaced, which is sometimes another word for saved."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_009_FOUND_BODY",
    "title": "Found Body",
    "category": "FATE",
    "severity": "CATASTROPHIC",
    "tags": [
      "fate",
      "catastrophic",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 1,
    "cooldownDays": 90,
    "cause": "Old violence memory and bad fate.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FAT_009_FOUND_BODY_E1",
        "type": "modifyVariable",
        "targetResolver": "random character",
        "variableId": "character.isDead",
        "operation": "setTrue",
        "value": true,
        "playerVisible": true,
        "displayText": "Random character dead"
      },
      {
        "effectId": "FAT_009_FOUND_BODY_E2",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.momentum",
        "operation": "add",
        "value": 15,
        "playerVisible": true,
        "displayText": "Momentum +15"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FAT_009_FOUND_BODY",
        "title": "Found Body",
        "type": "CATASTROPHIC",
        "intensity": 95,
        "decayRate": "permanent",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_FAT_009_FOUND_BODY",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The dead return without permission.",
      "longText": "The dead return without permission."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_010_PERFECT_ALIBI",
    "title": "Perfect Alibi",
    "category": "FATE",
    "severity": "GOOD",
    "tags": [
      "fate",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Player heat high.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FAT_010_PERFECT_ALIBI_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.fortune",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Fortune +5"
      },
      {
        "effectId": "FAT_010_PERFECT_ALIBI_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.cash",
        "operation": "add",
        "value": 600,
        "playerVisible": true,
        "displayText": "Cash +600"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FAT_010_PERFECT_ALIBI_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "FAT_010_PERFECT_ALIBI_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FAT_010_PERFECT_ALIBI_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "FAT_010_PERFECT_ALIBI_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FAT_010_PERFECT_ALIBI_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "By pure chance, someone respectable remembers seeing you elsewhere.",
      "longText": "By pure chance, someone respectable remembers seeing you elsewhere."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_011_FALSE_ACCUSATION",
    "title": "False Accusation",
    "category": "FATE",
    "severity": "BAD",
    "tags": [
      "fate",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Random fate roll.",
    "requirements": [],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "FAT_011_FALSE_ACCUSATION_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.fortune",
        "operation": "subtract",
        "value": 5,
        "playerVisible": true,
        "displayText": "Fortune -5"
      },
      {
        "effectId": "FAT_011_FALSE_ACCUSATION_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Stress +6"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_FAT_011_FALSE_ACCUSATION",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A lie chooses your name because it fits in the mouth.",
      "longText": "A lie chooses your name because it fits in the mouth."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_012_A_GUN_JAMS",
    "title": "A Gun Jams",
    "category": "FATE",
    "severity": "NEUTRAL",
    "tags": [
      "fate",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "Violent conflict roll.",
    "requirements": [],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "FAT_012_A_GUN_JAMS_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.momentum",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Momentum +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A gun jams. Whether it saves you or damns you depends on whose gun it was.",
      "longText": "A gun jams. Whether it saves you or damns you depends on whose gun it was."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_013_UNEXPECTED_RAIN",
    "title": "Unexpected Rain",
    "category": "FATE",
    "severity": "NEUTRAL",
    "tags": [
      "fate",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "Fate/weather roll.",
    "requirements": [],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "FAT_013_UNEXPECTED_RAIN_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.momentum",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Momentum +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Rain arrives exactly when secrets need washing.",
      "longText": "Rain arrives exactly when secrets need washing."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_014_STRANGER_PAYS_DEBT",
    "title": "Stranger Pays Debt",
    "category": "FATE",
    "severity": "VERY_GOOD",
    "tags": [
      "fate",
      "very_good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 40,
    "cause": "Debt exists and rare fortune.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FAT_014_STRANGER_PAYS_DEBT_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.fortune",
        "operation": "add",
        "value": 10,
        "playerVisible": true,
        "displayText": "Fortune +10"
      },
      {
        "effectId": "FAT_014_STRANGER_PAYS_DEBT_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.cash",
        "operation": "add",
        "value": 2500,
        "playerVisible": true,
        "displayText": "Cash +2500"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FAT_014_STRANGER_PAYS_DEBT",
        "title": "Stranger Pays Debt",
        "type": "VERY_GOOD",
        "intensity": 75,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A debt is marked paid by someone who refuses to leave a name.",
      "longText": "A debt is marked paid by someone who refuses to leave a name."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_015_WRONG_MAN_ARRESTED",
    "title": "Wrong Man Arrested",
    "category": "FATE",
    "severity": "GOOD",
    "tags": [
      "fate",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Law heat high.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FAT_015_WRONG_MAN_ARRESTED_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.fortune",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Fortune +5"
      },
      {
        "effectId": "FAT_015_WRONG_MAN_ARRESTED_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.cash",
        "operation": "add",
        "value": 600,
        "playerVisible": true,
        "displayText": "Cash +600"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FAT_015_WRONG_MAN_ARRESTED_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "FAT_015_WRONG_MAN_ARRESTED_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FAT_015_WRONG_MAN_ARRESTED_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "FAT_015_WRONG_MAN_ARRESTED_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FAT_015_WRONG_MAN_ARRESTED_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The police arrest a man who looks enough like the story they wanted.",
      "longText": "The police arrest a man who looks enough like the story they wanted."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_016_OLD_ENEMY_DIES_ELSEWHERE",
    "title": "Old Enemy Dies Elsewhere",
    "category": "FATE",
    "severity": "VERY_GOOD",
    "tags": [
      "fate",
      "very_good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 40,
    "cause": "Rival/grudge exists.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FAT_016_OLD_ENEMY_DIES_ELSEWHERE_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.fortune",
        "operation": "add",
        "value": 10,
        "playerVisible": true,
        "displayText": "Fortune +10"
      },
      {
        "effectId": "FAT_016_OLD_ENEMY_DIES_ELSEWHERE_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.cash",
        "operation": "add",
        "value": 2500,
        "playerVisible": true,
        "displayText": "Cash +2500"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FAT_016_OLD_ENEMY_DIES_ELSEWHERE",
        "title": "Old Enemy Dies Elsewhere",
        "type": "VERY_GOOD",
        "intensity": 75,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "An old enemy dies in someone else's story.",
      "longText": "An old enemy dies in someone else's story."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_017_BAD_HORSE_TIP",
    "title": "Bad Horse Tip",
    "category": "FATE",
    "severity": "BAD",
    "tags": [
      "fate",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Cash positive and fate roll.",
    "requirements": [],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "FAT_017_BAD_HORSE_TIP_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.fortune",
        "operation": "subtract",
        "value": 5,
        "playerVisible": true,
        "displayText": "Fortune -5"
      },
      {
        "effectId": "FAT_017_BAD_HORSE_TIP_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Stress +6"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_FAT_017_BAD_HORSE_TIP",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A horse with a holy name runs like a sinner.",
      "longText": "A horse with a holy name runs like a sinner."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_018_MIRACLE_RECOVERY",
    "title": "Miracle Recovery",
    "category": "FATE",
    "severity": "VERY_GOOD",
    "tags": [
      "fate",
      "very_good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 40,
    "cause": "Character wounded/sick.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FAT_018_MIRACLE_RECOVERY_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.fortune",
        "operation": "add",
        "value": 10,
        "playerVisible": true,
        "displayText": "Fortune +10"
      },
      {
        "effectId": "FAT_018_MIRACLE_RECOVERY_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.cash",
        "operation": "add",
        "value": 2500,
        "playerVisible": true,
        "displayText": "Cash +2500"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FAT_018_MIRACLE_RECOVERY",
        "title": "Miracle Recovery",
        "type": "VERY_GOOD",
        "intensity": 75,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The doctor says he has no explanation. Nobody asks him for one.",
      "longText": "The doctor says he has no explanation. Nobody asks him for one."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_019_SUDDEN_BETRAYAL",
    "title": "Sudden Betrayal",
    "category": "FATE",
    "severity": "CATASTROPHIC",
    "tags": [
      "fate",
      "catastrophic",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 1,
    "cooldownDays": 90,
    "cause": "Low loyalty/high betrayal risk character exists.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FAT_019_SUDDEN_BETRAYAL_E1",
        "type": "modifyVariable",
        "targetResolver": "random character",
        "variableId": "character.isDead",
        "operation": "setTrue",
        "value": true,
        "playerVisible": true,
        "displayText": "Random character dead"
      },
      {
        "effectId": "FAT_019_SUDDEN_BETRAYAL_E2",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.momentum",
        "operation": "add",
        "value": 15,
        "playerVisible": true,
        "displayText": "Momentum +15"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FAT_019_SUDDEN_BETRAYAL",
        "title": "Sudden Betrayal",
        "type": "CATASTROPHIC",
        "intensity": 95,
        "decayRate": "permanent",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_FAT_019_SUDDEN_BETRAYAL",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "No warning. No speech. Just the knife where trust used to be.",
      "longText": "No warning. No speech. Just the knife where trust used to be."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_020_LUCKY_INTRODUCTION",
    "title": "Lucky Introduction",
    "category": "FATE",
    "severity": "GOOD",
    "tags": [
      "fate",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Opportunity/fate roll.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FAT_020_LUCKY_INTRODUCTION_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.fortune",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Fortune +5"
      },
      {
        "effectId": "FAT_020_LUCKY_INTRODUCTION_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.cash",
        "operation": "add",
        "value": 600,
        "playerVisible": true,
        "displayText": "Cash +600"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FAT_020_LUCKY_INTRODUCTION_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "FAT_020_LUCKY_INTRODUCTION_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FAT_020_LUCKY_INTRODUCTION_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "FAT_020_LUCKY_INTRODUCTION_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FAT_020_LUCKY_INTRODUCTION_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A stranger knows your name for the right reason.",
      "longText": "A stranger knows your name for the right reason."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_021_MISDELIVERED_LETTER",
    "title": "Misdelivered Letter",
    "category": "FATE",
    "severity": "NEUTRAL",
    "tags": [
      "fate",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "Random fate roll.",
    "requirements": [],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "FAT_021_MISDELIVERED_LETTER_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.momentum",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Momentum +4"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A letter reaches the wrong hands and becomes more valuable for it.",
      "longText": "A letter reaches the wrong hands and becomes more valuable for it."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_022_NEAR_MISS",
    "title": "Near Miss",
    "category": "FATE",
    "severity": "BAD",
    "tags": [
      "fate",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Trouble/violence roll.",
    "requirements": [],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "FAT_022_NEAR_MISS_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.fortune",
        "operation": "subtract",
        "value": 5,
        "playerVisible": true,
        "displayText": "Fortune -5"
      },
      {
        "effectId": "FAT_022_NEAR_MISS_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 6,
        "playerVisible": true,
        "displayText": "Stress +6"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_FAT_022_NEAR_MISS",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Something almost happens. Almost is enough to change sleep.",
      "longText": "Something almost happens. Almost is enough to change sleep."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_023_FORGOTTEN_CASH_BOX",
    "title": "Forgotten Cash Box",
    "category": "FATE",
    "severity": "GOOD",
    "tags": [
      "fate",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Low cash or good fortune.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FAT_023_FORGOTTEN_CASH_BOX_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.fortune",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Fortune +5"
      },
      {
        "effectId": "FAT_023_FORGOTTEN_CASH_BOX_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.cash",
        "operation": "add",
        "value": 600,
        "playerVisible": true,
        "displayText": "Cash +600"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A cash box is found behind rotten wood and bad accounting.",
      "longText": "A cash box is found behind rotten wood and bad accounting."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_024_SUDDEN_ILLNESS",
    "title": "Sudden Illness",
    "category": "FATE",
    "severity": "VERY_BAD",
    "tags": [
      "fate",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Random character fate roll.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FAT_024_SUDDEN_ILLNESS_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.fortune",
        "operation": "subtract",
        "value": 10,
        "playerVisible": true,
        "displayText": "Fortune -10"
      },
      {
        "effectId": "FAT_024_SUDDEN_ILLNESS_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.lawHeat",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Law heat +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FAT_024_SUDDEN_ILLNESS",
        "title": "Sudden Illness",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_FAT_024_SUDDEN_ILLNESS",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A body can betray faster than any friend.",
      "longText": "A body can betray faster than any friend."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FAT_025_OMINOUS_CALM",
    "title": "Ominous Calm",
    "category": "FATE",
    "severity": "CRITICAL",
    "tags": [
      "fate",
      "critical",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 2,
    "cooldownDays": 60,
    "cause": "Momentum too low for too long.",
    "requirements": [],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.momentum",
        "operator": "<",
        "value": 30,
        "weightAdd": 5
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FAT_025_OMINOUS_CALM_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.momentum",
        "operation": "add",
        "value": 14,
        "playerVisible": true,
        "displayText": "Momentum +14"
      },
      {
        "effectId": "FAT_025_OMINOUS_CALM_E2",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.fortune",
        "operation": "subtract",
        "value": 3,
        "playerVisible": true,
        "displayText": "Fortune -3"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FAT_025_OMINOUS_CALM_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "FAT_025_OMINOUS_CALM_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FAT_025_OMINOUS_CALM_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "FAT_025_OMINOUS_CALM_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FAT_025_OMINOUS_CALM_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FAT_025_OMINOUS_CALM",
        "title": "Ominous Calm",
        "type": "CRITICAL",
        "intensity": 85,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [
      {
        "seedId": "SEED_FAT_025_OMINOUS_CALM",
        "category": "FOLLOW_UP",
        "delayDaysMin": 7,
        "delayDaysMax": 45,
        "notes": "Future follow-up may reference this event once event chains are implemented."
      }
    ],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Nothing happens. That is what makes it suspicious.",
      "longText": "Nothing happens. That is what makes it suspicious."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_001_THE_MAN_YOU_SPARED_RETURNS",
    "title": "The Man You Spared Returns",
    "category": "FOLLOW_UP",
    "severity": "GOOD",
    "tags": [
      "follow_up",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Spared enemy memory exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FOL_001_THE_MAN_YOU_SPARED_RETURNS_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.trust",
        "operation": "add",
        "value": 10,
        "playerVisible": true,
        "displayText": "Trust +10"
      },
      {
        "effectId": "FOL_001_THE_MAN_YOU_SPARED_RETURNS_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.loyalty",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Loyalty +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Mercy comes back wearing a different coat.",
      "longText": "Mercy comes back wearing a different coat."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_002_THE_INSULT_BECOMES_A_FEUD",
    "title": "The Insult Becomes a Feud",
    "category": "FOLLOW_UP",
    "severity": "VERY_BAD",
    "tags": [
      "follow_up",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Public insult memory exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FOL_002_THE_INSULT_BECOMES_A_FEUD_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 20,
        "playerVisible": true,
        "displayText": "Grudge +20"
      },
      {
        "effectId": "FOL_002_THE_INSULT_BECOMES_A_FEUD_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "subtract",
        "value": 8,
        "playerVisible": true,
        "displayText": "Internal stability -8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FOL_002_THE_INSULT_BECOMES_A_FEUD",
        "title": "The Insult Becomes a Feud",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The insult grows legs, finds friends, and learns where you live.",
      "longText": "The insult grows legs, finds friends, and learns where you live."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_003_THE_DEBT_WORSENS",
    "title": "The Debt Worsens",
    "category": "FOLLOW_UP",
    "severity": "BAD",
    "tags": [
      "follow_up",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Ignored debt seed exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "FOL_003_THE_DEBT_WORSENS_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 10,
        "playerVisible": true,
        "displayText": "Grudge +10"
      },
      {
        "effectId": "FOL_003_THE_DEBT_WORSENS_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Stress +5"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Debt does not sleep. It only gains weight.",
      "longText": "Debt does not sleep. It only gains weight."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_004_SAVED_LIFE_REPAID",
    "title": "Saved Life Repaid",
    "category": "FOLLOW_UP",
    "severity": "VERY_GOOD",
    "tags": [
      "follow_up",
      "very_good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 40,
    "cause": "Saved life memory exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FOL_004_SAVED_LIFE_REPAID_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.loyalty",
        "operation": "add",
        "value": 18,
        "playerVisible": true,
        "displayText": "Loyalty +18"
      },
      {
        "effectId": "FOL_004_SAVED_LIFE_REPAID_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.cash",
        "operation": "add",
        "value": 1000,
        "playerVisible": true,
        "displayText": "Cash +1000"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FOL_004_SAVED_LIFE_REPAID",
        "title": "Saved Life Repaid",
        "type": "VERY_GOOD",
        "intensity": 75,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A life saved becomes a favor with interest.",
      "longText": "A life saved becomes a favor with interest."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_005_OLD_THREAT_ESCALATES",
    "title": "Old Threat Escalates",
    "category": "FOLLOW_UP",
    "severity": "VERY_BAD",
    "tags": [
      "follow_up",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Threat ignored seed exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FOL_005_OLD_THREAT_ESCALATES_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 20,
        "playerVisible": true,
        "displayText": "Grudge +20"
      },
      {
        "effectId": "FOL_005_OLD_THREAT_ESCALATES_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "subtract",
        "value": 8,
        "playerVisible": true,
        "displayText": "Internal stability -8"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FOL_005_OLD_THREAT_ESCALATES_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "FOL_005_OLD_THREAT_ESCALATES_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FOL_005_OLD_THREAT_ESCALATES_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "FOL_005_OLD_THREAT_ESCALATES_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FOL_005_OLD_THREAT_ESCALATES_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FOL_005_OLD_THREAT_ESCALATES",
        "title": "Old Threat Escalates",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A threat ignored becomes a schedule.",
      "longText": "A threat ignored becomes a schedule."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_006_IGNORED_SPOUSE_CONSEQUENCE",
    "title": "Ignored Spouse Consequence",
    "category": "FOLLOW_UP",
    "severity": "BAD",
    "tags": [
      "follow_up",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Spouse neglect memory exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "FOL_006_IGNORED_SPOUSE_CONSEQUENCE_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 10,
        "playerVisible": true,
        "displayText": "Grudge +10"
      },
      {
        "effectId": "FOL_006_IGNORED_SPOUSE_CONSEQUENCE_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Stress +5"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Silence in a marriage is still a conversation.",
      "longText": "Silence in a marriage is still a conversation."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_007_PROMISED_PROMOTION_COMES_DUE",
    "title": "Promised Promotion Comes Due",
    "category": "FOLLOW_UP",
    "severity": "CRITICAL",
    "tags": [
      "follow_up",
      "critical",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 2,
    "cooldownDays": 60,
    "cause": "Promotion promise seed exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.momentum",
        "operator": "<",
        "value": 30,
        "weightAdd": 5
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FOL_007_PROMISED_PROMOTION_COMES_DUE_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.momentum",
        "operation": "add",
        "value": 12,
        "playerVisible": true,
        "displayText": "Momentum +12"
      },
      {
        "effectId": "FOL_007_PROMISED_PROMOTION_COMES_DUE_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.reputation",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Reputation shifts +3"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FOL_007_PROMISED_PROMOTION_COMES_DUE",
        "title": "Promised Promotion Comes Due",
        "type": "CRITICAL",
        "intensity": 85,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Promises made in private become debts paid in public.",
      "longText": "Promises made in private become debts paid in public."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_008_FUNERAL_BOND_DEEPENS",
    "title": "Funeral Bond Deepens",
    "category": "FOLLOW_UP",
    "severity": "GOOD",
    "tags": [
      "follow_up",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Funeral attendance memory exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FOL_008_FUNERAL_BOND_DEEPENS_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.trust",
        "operation": "add",
        "value": 10,
        "playerVisible": true,
        "displayText": "Trust +10"
      },
      {
        "effectId": "FOL_008_FUNERAL_BOND_DEEPENS_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.loyalty",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Loyalty +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Grief does not make people kinder. Sometimes it makes them closer.",
      "longText": "Grief does not make people kinder. Sometimes it makes them closer."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_009_RUMOR_MUTATES",
    "title": "Rumor Mutates",
    "category": "FOLLOW_UP",
    "severity": "BAD",
    "tags": [
      "follow_up",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Rumor seed exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "FOL_009_RUMOR_MUTATES_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 10,
        "playerVisible": true,
        "displayText": "Grudge +10"
      },
      {
        "effectId": "FOL_009_RUMOR_MUTATES_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Stress +5"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The story changes with every mouth and improves in none of them.",
      "longText": "The story changes with every mouth and improves in none of them."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_010_OLD_FAVOR_CALLED_IN",
    "title": "Old Favor Called In",
    "category": "FOLLOW_UP",
    "severity": "NEUTRAL",
    "tags": [
      "follow_up",
      "neutral",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 12,
    "cooldownDays": 12,
    "cause": "Favor owed memory exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "FOL_010_OLD_FAVOR_CALLED_IN_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.momentum",
        "operation": "add",
        "value": 4,
        "playerVisible": true,
        "displayText": "Momentum +4"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FOL_010_OLD_FAVOR_CALLED_IN_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "FOL_010_OLD_FAVOR_CALLED_IN_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FOL_010_OLD_FAVOR_CALLED_IN_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "FOL_010_OLD_FAVOR_CALLED_IN_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FOL_010_OLD_FAVOR_CALLED_IN_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A favor returns with a hat in its hands and a knife in its pocket.",
      "longText": "A favor returns with a hat in its hands and a knife in its pocket."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_011_RIVALRY_TURNS_PRODUCTIVE",
    "title": "Rivalry Turns Productive",
    "category": "FOLLOW_UP",
    "severity": "GOOD",
    "tags": [
      "follow_up",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Respected rivalry exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FOL_011_RIVALRY_TURNS_PRODUCTIVE_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.trust",
        "operation": "add",
        "value": 10,
        "playerVisible": true,
        "displayText": "Trust +10"
      },
      {
        "effectId": "FOL_011_RIVALRY_TURNS_PRODUCTIVE_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.loyalty",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Loyalty +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Competition sharpens the men it does not kill.",
      "longText": "Competition sharpens the men it does not kill."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_012_RIVALRY_TURNS_VIOLENT",
    "title": "Rivalry Turns Violent",
    "category": "FOLLOW_UP",
    "severity": "VERY_BAD",
    "tags": [
      "follow_up",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Destructive rivalry exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FOL_012_RIVALRY_TURNS_VIOLENT_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 20,
        "playerVisible": true,
        "displayText": "Grudge +20"
      },
      {
        "effectId": "FOL_012_RIVALRY_TURNS_VIOLENT_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "subtract",
        "value": 8,
        "playerVisible": true,
        "displayText": "Internal stability -8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FOL_012_RIVALRY_TURNS_VIOLENT",
        "title": "Rivalry Turns Violent",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The rivalry stops being funny when blood reaches the floor.",
      "longText": "The rivalry stops being funny when blood reaches the floor."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_013_BLACKMAIL_RETURNS",
    "title": "Blackmail Returns",
    "category": "FOLLOW_UP",
    "severity": "VERY_BAD",
    "tags": [
      "follow_up",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Blackmail seed exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FOL_013_BLACKMAIL_RETURNS_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 20,
        "playerVisible": true,
        "displayText": "Grudge +20"
      },
      {
        "effectId": "FOL_013_BLACKMAIL_RETURNS_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "subtract",
        "value": 8,
        "playerVisible": true,
        "displayText": "Internal stability -8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FOL_013_BLACKMAIL_RETURNS",
        "title": "Blackmail Returns",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Secrets do not stay bought. They rent themselves out.",
      "longText": "Secrets do not stay bought. They rent themselves out."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_014_MENTORS_LESSON_PAYS_OFF",
    "title": "Mentor's Lesson Pays Off",
    "category": "FOLLOW_UP",
    "severity": "GOOD",
    "tags": [
      "follow_up",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Mentorship memory exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FOL_014_MENTORS_LESSON_PAYS_OFF_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.trust",
        "operation": "add",
        "value": 10,
        "playerVisible": true,
        "displayText": "Trust +10"
      },
      {
        "effectId": "FOL_014_MENTORS_LESSON_PAYS_OFF_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.loyalty",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Loyalty +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A lesson returns at the moment it is needed.",
      "longText": "A lesson returns at the moment it is needed."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_015_MERCY_EXPLOITED",
    "title": "Mercy Exploited",
    "category": "FOLLOW_UP",
    "severity": "BAD",
    "tags": [
      "follow_up",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Spared enemy with low trust exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "FOL_015_MERCY_EXPLOITED_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 10,
        "playerVisible": true,
        "displayText": "Grudge +10"
      },
      {
        "effectId": "FOL_015_MERCY_EXPLOITED_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Stress +5"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FOL_015_MERCY_EXPLOITED_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "FOL_015_MERCY_EXPLOITED_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FOL_015_MERCY_EXPLOITED_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "FOL_015_MERCY_EXPLOITED_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FOL_015_MERCY_EXPLOITED_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Mercy is noble. It is not always wise.",
      "longText": "Mercy is noble. It is not always wise."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_016_FAMILY_DEBT_REPAID",
    "title": "Family Debt Repaid",
    "category": "FOLLOW_UP",
    "severity": "GOOD",
    "tags": [
      "follow_up",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Paid family debt memory exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FOL_016_FAMILY_DEBT_REPAID_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.trust",
        "operation": "add",
        "value": 10,
        "playerVisible": true,
        "displayText": "Trust +10"
      },
      {
        "effectId": "FOL_016_FAMILY_DEBT_REPAID_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.loyalty",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Loyalty +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Blood remembers money differently than banks do.",
      "longText": "Blood remembers money differently than banks do."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_017_POLICE_FILE_REOPENED",
    "title": "Police File Reopened",
    "category": "FOLLOW_UP",
    "severity": "VERY_BAD",
    "tags": [
      "follow_up",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Old law heat/evidence seed exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FOL_017_POLICE_FILE_REOPENED_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 20,
        "playerVisible": true,
        "displayText": "Grudge +20"
      },
      {
        "effectId": "FOL_017_POLICE_FILE_REOPENED_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "subtract",
        "value": 8,
        "playerVisible": true,
        "displayText": "Internal stability -8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FOL_017_POLICE_FILE_REOPENED",
        "title": "Police File Reopened",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A file thought dead grows a new signature.",
      "longText": "A file thought dead grows a new signature."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_018_CREW_TRUST_RESTORED",
    "title": "Crew Trust Restored",
    "category": "FOLLOW_UP",
    "severity": "GOOD",
    "tags": [
      "follow_up",
      "good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 16,
    "cause": "Successful mediation seed exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FOL_018_CREW_TRUST_RESTORED_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.trust",
        "operation": "add",
        "value": 10,
        "playerVisible": true,
        "displayText": "Trust +10"
      },
      {
        "effectId": "FOL_018_CREW_TRUST_RESTORED_E2",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.loyalty",
        "operation": "add",
        "value": 8,
        "playerVisible": true,
        "displayText": "Loyalty +8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "Men who were sharpening knives settle for sharing cigarettes.",
      "longText": "Men who were sharpening knives settle for sharing cigarettes."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_019_CREW_TRUST_BREAKS",
    "title": "Crew Trust Breaks",
    "category": "FOLLOW_UP",
    "severity": "VERY_BAD",
    "tags": [
      "follow_up",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Failed mediation seed exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FOL_019_CREW_TRUST_BREAKS_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 20,
        "playerVisible": true,
        "displayText": "Grudge +20"
      },
      {
        "effectId": "FOL_019_CREW_TRUST_BREAKS_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "subtract",
        "value": 8,
        "playerVisible": true,
        "displayText": "Internal stability -8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FOL_019_CREW_TRUST_BREAKS",
        "title": "Crew Trust Breaks",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "The crew stops arguing in front of you. That is worse.",
      "longText": "The crew stops arguing in front of you. That is worse."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_020_THE_WIDOW_ASKS_WHY",
    "title": "The Widow Asks Why",
    "category": "FOLLOW_UP",
    "severity": "BAD",
    "tags": [
      "follow_up",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Death caused by player/mafia seed exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "FOL_020_THE_WIDOW_ASKS_WHY_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 10,
        "playerVisible": true,
        "displayText": "Grudge +10"
      },
      {
        "effectId": "FOL_020_THE_WIDOW_ASKS_WHY_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Stress +5"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FOL_020_THE_WIDOW_ASKS_WHY_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "FOL_020_THE_WIDOW_ASKS_WHY_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FOL_020_THE_WIDOW_ASKS_WHY_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "FOL_020_THE_WIDOW_ASKS_WHY_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FOL_020_THE_WIDOW_ASKS_WHY_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A widow asks a question everyone knows not to answer.",
      "longText": "A widow asks a question everyone knows not to answer."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_021_OLD_CONTACT_BECOMES_ASSET",
    "title": "Old Contact Becomes Asset",
    "category": "FOLLOW_UP",
    "severity": "VERY_GOOD",
    "tags": [
      "follow_up",
      "very_good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 40,
    "cause": "Positive contact memory exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FOL_021_OLD_CONTACT_BECOMES_ASSET_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.loyalty",
        "operation": "add",
        "value": 18,
        "playerVisible": true,
        "displayText": "Loyalty +18"
      },
      {
        "effectId": "FOL_021_OLD_CONTACT_BECOMES_ASSET_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.cash",
        "operation": "add",
        "value": 1000,
        "playerVisible": true,
        "displayText": "Cash +1000"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FOL_021_OLD_CONTACT_BECOMES_ASSET",
        "title": "Old Contact Becomes Asset",
        "type": "VERY_GOOD",
        "intensity": 75,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A small contact grows into a useful door.",
      "longText": "A small contact grows into a useful door."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_022_OLD_CONTACT_BECOMES_LIABILITY",
    "title": "Old Contact Becomes Liability",
    "category": "FOLLOW_UP",
    "severity": "BAD",
    "tags": [
      "follow_up",
      "bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 10,
    "cooldownDays": 18,
    "cause": "Neglected contact memory exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [],
    "immediateEffects": [
      {
        "effectId": "FOL_022_OLD_CONTACT_BECOMES_LIABILITY_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 10,
        "playerVisible": true,
        "displayText": "Grudge +10"
      },
      {
        "effectId": "FOL_022_OLD_CONTACT_BECOMES_LIABILITY_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.stress",
        "operation": "add",
        "value": 5,
        "playerVisible": true,
        "displayText": "Stress +5"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A forgotten contact remembers enough to be dangerous.",
      "longText": "A forgotten contact remembers enough to be dangerous."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_023_PROMISE_KEPT",
    "title": "Promise Kept",
    "category": "FOLLOW_UP",
    "severity": "VERY_GOOD",
    "tags": [
      "follow_up",
      "very_good",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 40,
    "cause": "Promise fulfilled seed exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": ">",
        "value": 55,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.stability",
        "operator": "<",
        "value": 35,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FOL_023_PROMISE_KEPT_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.loyalty",
        "operation": "add",
        "value": 18,
        "playerVisible": true,
        "displayText": "Loyalty +18"
      },
      {
        "effectId": "FOL_023_PROMISE_KEPT_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.cash",
        "operation": "add",
        "value": 1000,
        "playerVisible": true,
        "displayText": "Cash +1000"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FOL_023_PROMISE_KEPT",
        "title": "Promise Kept",
        "type": "VERY_GOOD",
        "intensity": 75,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A kept promise is worth more than a paid debt.",
      "longText": "A kept promise is worth more than a paid debt."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_024_PROMISE_BROKEN",
    "title": "Promise Broken",
    "category": "FOLLOW_UP",
    "severity": "VERY_BAD",
    "tags": [
      "follow_up",
      "very_bad",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 4,
    "cooldownDays": 35,
    "cause": "Promise broken seed exists.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.fortune",
        "operator": "<",
        "value": 35,
        "weightAdd": 4
      },
      {
        "type": "variableWeight",
        "variableId": "providence.prosperity",
        "operator": ">",
        "value": 70,
        "weightAdd": 3
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FOL_024_PROMISE_BROKEN_E1",
        "type": "modifyVariable",
        "targetResolver": "target character",
        "variableId": "relationship.grudge",
        "operation": "add",
        "value": 20,
        "playerVisible": true,
        "displayText": "Grudge +20"
      },
      {
        "effectId": "FOL_024_PROMISE_BROKEN_E2",
        "type": "modifyVariable",
        "targetResolver": "mafia",
        "variableId": "mafia.internalStability",
        "operation": "subtract",
        "value": 8,
        "playerVisible": true,
        "displayText": "Internal stability -8"
      }
    ],
    "choices": [],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FOL_024_PROMISE_BROKEN",
        "title": "Promise Broken",
        "type": "VERY_BAD",
        "intensity": 70,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "A broken promise makes future words cheaper.",
      "longText": "A broken promise makes future words cheaper."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  },
  {
    "id": "FOL_025_THE_CITY_REMEMBERS",
    "title": "The City Remembers",
    "category": "FOLLOW_UP",
    "severity": "CRITICAL",
    "tags": [
      "follow_up",
      "critical",
      "starter-pack"
    ],
    "unique": false,
    "enabled": true,
    "triggerMode": "weighted",
    "baseWeight": 2,
    "cooldownDays": 60,
    "cause": "Multiple strong memories around same target exist.",
    "requirements": [
      {
        "type": "eventSeedExists",
        "targetResolver": "event",
        "variableId": "event.followUpSeedActive",
        "operator": "==",
        "value": true
      }
    ],
    "weightModifiers": [
      {
        "type": "variableWeight",
        "variableId": "providence.momentum",
        "operator": "<",
        "value": 30,
        "weightAdd": 5
      }
    ],
    "immediateEffects": [
      {
        "effectId": "FOL_025_THE_CITY_REMEMBERS_E1",
        "type": "modifyVariable",
        "targetResolver": "providence",
        "variableId": "providence.momentum",
        "operation": "add",
        "value": 12,
        "playerVisible": true,
        "displayText": "Momentum +12"
      },
      {
        "effectId": "FOL_025_THE_CITY_REMEMBERS_E2",
        "type": "modifyVariable",
        "targetResolver": "player",
        "variableId": "player.reputation",
        "operation": "add",
        "value": 3,
        "playerVisible": true,
        "displayText": "Reputation shifts +3"
      }
    ],
    "choices": [
      {
        "id": "handle_directly",
        "label": "Handle it personally.",
        "description": "Spend time and reputation to control the situation.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FOL_025_THE_CITY_REMEMBERS_C1",
            "type": "modifyVariable",
            "targetResolver": "player",
            "variableId": "player.stress",
            "operation": "add",
            "value": 3,
            "playerVisible": true,
            "displayText": "Stress +3"
          },
          {
            "effectId": "FOL_025_THE_CITY_REMEMBERS_C2",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Momentum +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "More control, more personal pressure.",
        "visibleEffects": true
      },
      {
        "id": "delegate",
        "label": "Delegate it.",
        "description": "Let someone else handle the details.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FOL_025_THE_CITY_REMEMBERS_C3",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "character.performance",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate performance +2"
          },
          {
            "effectId": "FOL_025_THE_CITY_REMEMBERS_C4",
            "type": "modifyVariable",
            "targetResolver": "random member",
            "variableId": "relationship.trust",
            "operation": "add",
            "value": 2,
            "playerVisible": true,
            "displayText": "Delegate trust +2"
          }
        ],
        "aiHint": "",
        "riskPreview": "Less personal control, may build subordinate value.",
        "visibleEffects": true
      },
      {
        "id": "ignore",
        "label": "Ignore it for now.",
        "description": "Let the city move without your hand.",
        "requirements": [],
        "effects": [
          {
            "effectId": "FOL_025_THE_CITY_REMEMBERS_C5",
            "type": "modifyVariable",
            "targetResolver": "providence",
            "variableId": "providence.momentum",
            "operation": "add",
            "value": 1,
            "playerVisible": true,
            "displayText": "Momentum +1"
          }
        ],
        "aiHint": "",
        "riskPreview": "May create future follow-up.",
        "visibleEffects": true
      }
    ],
    "afterEffects": [],
    "createsMemory": [
      {
        "memoryId": "MEM_FOL_025_THE_CITY_REMEMBERS",
        "title": "The City Remembers",
        "type": "CRITICAL",
        "intensity": 85,
        "decayRate": "slow",
        "knownBy": [
          "player"
        ],
        "relationshipEffects": []
      }
    ],
    "createsFollowUpSeeds": [],
    "flair": {
      "narratorTone": "grounded, noir, intimate, mafia-management",
      "shortText": "One event becomes a pattern. A pattern becomes reputation. Reputation becomes fate.",
      "longText": "One event becomes a pattern. A pattern becomes reputation. Reputation becomes fate."
    },
    "debugNotes": "Starter Event Pack v0.1. Some effects reference future systems and should safely no-op, queue, or remain editable until those systems exist."
  }
];
