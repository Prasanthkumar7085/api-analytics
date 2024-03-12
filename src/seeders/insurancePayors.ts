import { insurance_payors } from '../drizzle/schemas/insurancePayors'
import { db } from './db'


export default {
    insuranceSeeder: async (title) => {
        let data = await db.insert(insurance_payors).values([
            {
                "id": 1,
                "name": "SecureGuard Insurance",
                "refId": "INC1"
            },
            {
                "id": 2,
                "name": "Liberty Mutual Assurance",
                "refId": "INC2"
            },
            {
                "id": 3,
                "name": "SafeHarbor Underwriters",
                "refId": "INC3"
            },
            {
                "id": 4,
                "name": "EverSafe Insurance Solutions",
                "refId": "INC4"
            },
            {
                "id": 5,
                "name": "United Coverage Providers",
                "refId": "INC5"
            },
            {
                "id": 6,
                "name": "Guardian Shield Insurers",
                "refId": "INC6"
            },
            {
                "id": 7,
                "name": "Paramount Assurance Group",
                "refId": "INC7"
            },
            {
                "id": 8,
                "name": "SafeNet Insurance Services",
                "refId": "INC8"
            },
            {
                "id": 9,
                "name": "Horizon Risk Management",
                "refId": "INC9"
            },
            {
                "id": 10,
                "name": "EliteCoverage Advisors",
                "refId": "INC10"
            },
            {
                "id": 11,
                "name": "Patriot Insurance Co.",
                "refId": "INC11"
            },
            {
                "id": 12,
                "name": "Safeguard Assurance",
                "refId": "INC12"
            },
            {
                "id": 13,
                "name": "Nationwide Protection Partners",
                "refId": "INC13"
            },
            {
                "id": 14,
                "name": "Premier Assurance Networks",
                "refId": "INC14"
            },
            {
                "id": 15,
                "name": "Trustworthy Underwriters",
                "refId": "INC15"
            },
            {
                "id": 16,
                "name": "Liberty Star Insurance",
                "refId": "INC16"
            },
            {
                "id": 17,
                "name": "SecureHorizon Assurance",
                "refId": "INC17"
            },
            {
                "id": 18,
                "name": "AllSure Coverage Corporation",
                "refId": "INC18"
            },
            {
                "id": 19,
                "name": "Integrity Insurance Agency",
                "refId": "INC19"
            },
            {
                "id": 20,
                "name": "SecureLife Insurers",
                "refId": "INC20"
            },
            {
                "id": 21,
                "name": "Unity Coverage Providers",
                "refId": "INC21"
            },
            {
                "id": 22,
                "name": "American Safety Net",
                "refId": "INC22"
            },
            {
                "id": 23,
                "name": "GoldenGuard Insurance",
                "refId": "INC23"
            },
            {
                "id": 24,
                "name": "Platinum Shield Assurance",
                "refId": "INC24"
            },
            {
                "id": 25,
                "name": "GlobalSafe Underwriters",
                "refId": "INC25"
            },
            {
                "id": 26,
                "name": "Assurance Alliance Group",
                "refId": "INC26"
            },
            {
                "id": 27,
                "name": "SecureHarbor Insurance",
                "refId": "INC27"
            },
            {
                "id": 28,
                "name": "TrustPoint Coverage Co.",
                "refId": "INC28"
            },
            {
                "id": 29,
                "name": "ProGuard Insurance Solutions",
                "refId": "INC29"
            },
            {
                "id": 30,
                "name": "ShieldNation Underwriters",
                "refId": "INC30"
            },
            {
                "id": 31,
                "name": "CapitalSafe Assurance",
                "refId": "INC31"
            },
            {
                "id": 32,
                "name": "FirstLine Insurance Agency",
                "refId": "INC32"
            },
            {
                "id": 33,
                "name": "Horizon Guard Group",
                "refId": "INC33"
            },
            {
                "id": 34,
                "name": "SecureBridge Underwriters",
                "refId": "INC34"
            },
            {
                "id": 35,
                "name": "Paramount Coverage Partners",
                "refId": "INC35"
            },
            {
                "id": 36,
                "name": "PrimeGuard Assurance",
                "refId": "INC36"
            },
            {
                "id": 37,
                "name": "National Security Insurers",
                "refId": "INC37"
            },
            {
                "id": 38,
                "name": "EverSure Insurance Services",
                "refId": "INC38"
            },
            {
                "id": 39,
                "name": "Liberty Bridge Underwriters",
                "refId": "INC39"
            },
            {
                "id": 40,
                "name": "United Protection Co.",
                "refId": "INC40"
            },
            {
                "id": 41,
                "name": "Legacy Assurance Networks",
                "refId": "INC41"
            },
            {
                "id": 42,
                "name": "TrustGuard Insurance",
                "refId": "INC42"
            },
            {
                "id": 43,
                "name": "American Shield Insurance",
                "refId": "INC43"
            },
            {
                "id": 44,
                "name": "HorizonStar Assurance",
                "refId": "INC44"
            },
            {
                "id": 45,
                "name": "Platinum Coverage Advisors",
                "refId": "INC45"
            },
            {
                "id": 46,
                "name": "SafePath Insurance Solutions",
                "refId": "INC46"
            },
            {
                "id": 47,
                "name": "SecureFront Insurance",
                "refId": "INC47"
            },
            {
                "id": 48,
                "name": "SafePoint Assurance Group",
                "refId": "INC48"
            },
            {
                "id": 49,
                "name": "Guardian Coverage Providers",
                "refId": "INC49"
            },
            {
                "id": 50,
                "name": "Prestige Assurance Networks",
                "refId": "INC50"
            },
            {
                "id": 51,
                "name": "EliteGuard Insurance",
                "refId": "INC51"
            },
            {
                "id": 52,
                "name": "SecureNation Underwriters",
                "refId": "INC52"
            },
            {
                "id": 53,
                "name": "HorizonLife Insurance",
                "refId": "INC53"
            },
            {
                "id": 54,
                "name": "UnitedRisk Assurance",
                "refId": "INC54"
            },
            {
                "id": 55,
                "name": "Paramount Safety Net",
                "refId": "INC55"
            },
            {
                "id": 56,
                "name": "ShieldBridge Underwriters",
                "refId": "INC56"
            },
            {
                "id": 57,
                "name": "NationalSure Coverage Corporation",
                "refId": "INC57"
            },
            {
                "id": 58,
                "name": "TrustBridge Insurance Agency",
                "refId": "INC58"
            },
            {
                "id": 59,
                "name": "CapitalGuard Assurance",
                "refId": "INC59"
            },
            {
                "id": 60,
                "name": "Integrity Protection Partners",
                "refId": "INC60"
            },
            {
                "id": 61,
                "name": "SafeZone Assurance",
                "refId": "INC61"
            },
            {
                "id": 62,
                "name": "Unity Assurance Group",
                "refId": "INC62"
            },
            {
                "id": 63,
                "name": "SecurePro Insurance",
                "refId": "INC63"
            },
            {
                "id": 64,
                "name": "LibertyNet Underwriters",
                "refId": "INC64"
            },
            {
                "id": 65,
                "name": "PlatinumGuard Insurance",
                "refId": "INC65"
            },
            {
                "id": 66,
                "name": "AmericanElite Assurance",
                "refId": "INC66"
            },
            {
                "id": 67,
                "name": "Premier Coverage Advisors",
                "refId": "INC67"
            },
            {
                "id": 68,
                "name": "TrustNet Insurance Solutions",
                "refId": "INC68"
            },
            {
                "id": 69,
                "name": "EliteHarbor Assurance",
                "refId": "INC69"
            },
            {
                "id": 70,
                "name": "SafeStar Coverage Partners",
                "refId": "INC70"
            },
            {
                "id": 71,
                "name": "EverGuard Insurance Co.",
                "refId": "INC71"
            },
            {
                "id": 72,
                "name": "SecureUnity Underwriters",
                "refId": "INC72"
            },
            {
                "id": 73,
                "name": "Guardian Safety Net",
                "refId": "INC73"
            },
            {
                "id": 74,
                "name": "ParamountGuard Insurance",
                "refId": "INC74"
            },
            {
                "id": 75,
                "name": "ShieldSure Assurance",
                "refId": "INC75"
            },
            {
                "id": 76,
                "name": "NationalBridge Insurance",
                "refId": "INC76"
            },
            {
                "id": 77,
                "name": "TrustGuard Coverage Corporation",
                "refId": "INC77"
            },
            {
                "id": 78,
                "name": "SafeVista Insurance Agency",
                "refId": "INC78"
            },
            {
                "id": 79,
                "name": "IntegrityNation Underwriters",
                "refId": "INC79"
            },
            {
                "id": 80,
                "name": "EliteNet Insurance Services",
                "refId": "INC80"
            },
            {
                "id": 81,
                "name": "PrimeGuard Assurance Group",
                "refId": "INC81"
            },
            {
                "id": 82,
                "name": "HorizonBridge Underwriters",
                "refId": "INC82"
            },
            {
                "id": 83,
                "name": "TrustSafe Assurance",
                "refId": "INC83"
            },
            {
                "id": 84,
                "name": "American Horizon Insurance",
                "refId": "INC84"
            },
            {
                "id": 85,
                "name": "SecureTrust Coverage Partners",
                "refId": "INC85"
            },
            {
                "id": 86,
                "name": "LibertyHarbor Assurance",
                "refId": "INC86"
            },
            {
                "id": 87,
                "name": "SafeFront Insurance",
                "refId": "INC87"
            },
            {
                "id": 88,
                "name": "ShieldPoint Assurance",
                "refId": "INC88"
            },
            {
                "id": 89,
                "name": "ParamountLife Insurance",
                "refId": "INC89"
            },
            {
                "id": 90,
                "name": "SecurePrime Assurance Networks",
                "refId": "INC90"
            },
            {
                "id": 91,
                "name": "ProCoverage Underwriters",
                "refId": "INC91"
            },
            {
                "id": 92,
                "name": "GoldenBridge Insurance",
                "refId": "INC92"
            },
            {
                "id": 93,
                "name": "Unity Assurance Advisors",
                "refId": "INC93"
            },
            {
                "id": 94,
                "name": "SafeNation Insurance Solutions",
                "refId": "INC94"
            },
            {
                "id": 95,
                "name": "PrestigeNet Assurance",
                "refId": "INC95"
            },
            {
                "id": 96,
                "name": "GuardianElite Insurance Co.",
                "refId": "INC96"
            },
            {
                "id": 97,
                "name": "HorizonPro Coverage Corporation",
                "refId": "INC97"
            },
            {
                "id": 98,
                "name": "PlatinumBridge Underwriters",
                "refId": "INC98"
            },
            {
                "id": 99,
                "name": "SecureNation Insurance",
                "refId": "INC99"
            },
            {
                "id": 100,
                "name": "TrustLife Assurance Group",
                "refId": "INC100"
            }
        ]).returning()
        console.log(data)
        console.log(title, "Data Seeded")
    }
}