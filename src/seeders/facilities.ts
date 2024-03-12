import { facilities } from '../drizzle/schemas/facilities'
import { db } from './db'


export default {
    seed: async (title) => {
        let data = await db.insert(facilities).values([
            {
              "id": 1,
              "name": "Mercy General Hospital",
              "refId": "FC1",
              "salesRepId": 1
            },
            {
              "id": 2,
              "name": "St. Vincent Medical Center",
              "refId": "FC2",
              "salesRepId": 1
            },
            {
              "id": 3,
              "name": "Providence Health Center",
              "refId": "FC3",
              "salesRepId": 1
            },
            {
              "id": 4,
              "name": "Riverside Community Hospital",
              "refId": "FC4",
              "salesRepId": 1
            },
            {
              "id": 5,
              "name": "Unity Medical Center",
              "refId": "FC5",
              "salesRepId": 1
            },
            {
              "id": 6,
              "name": "Oakwood Regional Hospital",
              "refId": "FC6",
              "salesRepId": 2
            },
            {
              "id": 7,
              "name": "Grace Hospital",
              "refId": "FC7",
              "salesRepId": 2
            },
            {
              "id": 8,
              "name": "Summit Healthcare",
              "refId": "FC8",
              "salesRepId": 2
            },
            {
              "id": 9,
              "name": "Pinecrest Medical Center",
              "refId": "FC9",
              "salesRepId": 2
            },
            {
              "id": 10,
              "name": "Beacon Hill Hospital",
              "refId": "FC10",
              "salesRepId": 2
            },
            {
              "id": 11,
              "name": "Evergreen Memorial Hospital",
              "refId": "FC11",
              "salesRepId": 3
            },
            {
              "id": 12,
              "name": "Harmony Health Services",
              "refId": "FC12",
              "salesRepId": 3
            },
            {
              "id": 13,
              "name": "Maple Grove Medical Center",
              "refId": "FC13",
              "salesRepId": 3
            },
            {
              "id": 14,
              "name": "Serenity Hospital",
              "refId": "FC14",
              "salesRepId": 3
            },
            {
              "id": 15,
              "name": "Pineview Regional Medical Center",
              "refId": "FC15",
              "salesRepId": 3
            },
            {
              "id": 16,
              "name": "Sunrise Hospital and Clinics",
              "refId": "FC16",
              "salesRepId": 4
            },
            {
              "id": 17,
              "name": "Redwood Healthcare System",
              "refId": "FC17",
              "salesRepId": 4
            },
            {
              "id": 18,
              "name": "Crestwood Community Hospital",
              "refId": "FC18",
              "salesRepId": 4
            },
            {
              "id": 19,
              "name": "Blue Ridge Medical Center",
              "refId": "FC19",
              "salesRepId": 4
            },
            {
              "id": 20,
              "name": "Golden Gate General Hospital",
              "refId": "FC20",
              "salesRepId": 4
            },
            {
              "id": 21,
              "name": "Unity Health Alliance",
              "refId": "FC21",
              "salesRepId": 5
            },
            {
              "id": 22,
              "name": "Sunset Medical Center",
              "refId": "FC22",
              "salesRepId": 5
            },
            {
              "id": 23,
              "name": "Liberty Hospital Network",
              "refId": "FC23",
              "salesRepId": 5
            },
            {
              "id": 24,
              "name": "Mountain View Regional Hospital",
              "refId": "FC24",
              "salesRepId": 5
            },
            {
              "id": 25,
              "name": "Valley Vista Medical Center",
              "refId": "FC25",
              "salesRepId": 5
            },
            {
              "id": 26,
              "name": "Haven Healthcare",
              "refId": "FC26",
              "salesRepId": 6
            },
            {
              "id": 27,
              "name": "Cascade Medical Group",
              "refId": "FC27",
              "salesRepId": 6
            },
            {
              "id": 28,
              "name": "Pacific Palms Hospital",
              "refId": "FC28",
              "salesRepId": 6
            },
            {
              "id": 29,
              "name": "Harborview Medical Center",
              "refId": "FC29",
              "salesRepId": 6
            },
            {
              "id": 30,
              "name": "Magnolia Medical Center",
              "refId": "FC30",
              "salesRepId": 6
            },
            {
              "id": 31,
              "name": "Lakeside Community Hospital",
              "refId": "FC31",
              "salesRepId": 7
            },
            {
              "id": 32,
              "name": "Fairview Regional Health",
              "refId": "FC32",
              "salesRepId": 7
            },
            {
              "id": 33,
              "name": "Everlast Hospital Group",
              "refId": "FC33",
              "salesRepId": 7
            },
            {
              "id": 34,
              "name": "Horizon Medical Associates",
              "refId": "FC34",
              "salesRepId": 7
            },
            {
              "id": 35,
              "name": "Elmwood General Hospital",
              "refId": "FC35",
              "salesRepId": 7
            },
            {
              "id": 36,
              "name": "Oasis Health System",
              "refId": "FC36",
              "salesRepId": 8
            },
            {
              "id": 37,
              "name": "Silver Lake Medical Center",
              "refId": "FC37",
              "salesRepId": 8
            },
            {
              "id": 38,
              "name": "Riverfront Health Services",
              "refId": "FC38",
              "salesRepId": 8
            },
            {
              "id": 39,
              "name": "Grandview Hospital and Clinics",
              "refId": "FC39",
              "salesRepId": 8
            },
            {
              "id": 40,
              "name": "Mountain Crest Healthcare",
              "refId": "FC40",
              "salesRepId": 8
            },
            {
              "id": 41,
              "name": "Clearwater Medical Center",
              "refId": "FC41",
              "salesRepId": 9
            },
            {
              "id": 42,
              "name": "Pine Hill Hospital Network",
              "refId": "FC42",
              "salesRepId": 9
            },
            {
              "id": 43,
              "name": "Meadowbrook General Hospital",
              "refId": "FC43",
              "salesRepId": 9
            },
            {
              "id": 44,
              "name": "Redwood Medical Associates",
              "refId": "FC44",
              "salesRepId": 9
            },
            {
              "id": 45,
              "name": "Twin Lakes Regional Hospital",
              "refId": "FC45",
              "salesRepId": 9
            },
            {
              "id": 46,
              "name": "Liberty Health Partners",
              "refId": "FC46",
              "salesRepId": 10
            },
            {
              "id": 47,
              "name": "Central Valley Medical Center",
              "refId": "FC47",
              "salesRepId": 10
            },
            {
              "id": 48,
              "name": "Starlight Healthcare Group",
              "refId": "FC48",
              "salesRepId": 10
            },
            {
              "id": 49,
              "name": "Aspen Regional Hospital",
              "refId": "FC49",
              "salesRepId": 10
            },
            {
              "id": 50,
              "name": "Tranquil Health Services",
              "refId": "FC50",
              "salesRepId": 10
            },
            {
              "id": 51,
              "name": "Willow Creek Medical Center",
              "refId": "FC51",
              "salesRepId": 11
            },
            {
              "id": 52,
              "name": "Maplewood General Hospital",
              "refId": "FC52",
              "salesRepId": 11
            },
            {
              "id": 53,
              "name": "Horizon Healthcare System",
              "refId": "FC53",
              "salesRepId": 11
            },
            {
              "id": 54,
              "name": "Emerald City Medical Center",
              "refId": "FC54",
              "salesRepId": 11
            },
            {
              "id": 55,
              "name": "Harmony Hospital Group",
              "refId": "FC55",
              "salesRepId": 11
            },
            {
              "id": 56,
              "name": "Sunset Health Services",
              "refId": "FC56",
              "salesRepId": 12
            },
            {
              "id": 57,
              "name": "Phoenix Regional Medical Center",
              "refId": "FC57",
              "salesRepId": 12
            },
            {
              "id": 58,
              "name": "Bayview Medical Associates",
              "refId": "FC58",
              "salesRepId": 12
            },
            {
              "id": 59,
              "name": "Pine Ridge Hospital Network",
              "refId": "FC59",
              "salesRepId": 12
            },
            {
              "id": 60,
              "name": "Meadowlark Health System",
              "refId": "FC60",
              "salesRepId": 12
            },
            {
              "id": 61,
              "name": "Crestview General Hospital",
              "refId": "FC61",
              "salesRepId": 13
            },
            {
              "id": 62,
              "name": "Coastal Community Health",
              "refId": "FC62",
              "salesRepId": 13
            },
            {
              "id": 63,
              "name": "Summit Healthcare Alliance",
              "refId": "FC63",
              "salesRepId": 13
            },
            {
              "id": 64,
              "name": "Cedar Grove Medical Center",
              "refId": "FC64",
              "salesRepId": 13
            },
            {
              "id": 65,
              "name": "Blue Sky Regional Hospital",
              "refId": "FC65",
              "salesRepId": 13
            },
            {
              "id": 66,
              "name": "Serenity Health Partners",
              "refId": "FC66",
              "salesRepId": 14
            },
            {
              "id": 67,
              "name": "Haven Medical Associates",
              "refId": "FC67",
              "salesRepId": 14
            },
            {
              "id": 68,
              "name": "Silver Springs Hospital",
              "refId": "FC68",
              "salesRepId": 14
            },
            {
              "id": 69,
              "name": "Evergreen Health Network",
              "refId": "FC69",
              "salesRepId": 14
            },
            {
              "id": 70,
              "name": "Horizon Medical Center",
              "refId": "FC70",
              "salesRepId": 14
            },
            {
              "id": 71,
              "name": "Beacon Healthcare Group",
              "refId": "FC71",
              "salesRepId": 15
            },
            {
              "id": 72,
              "name": "Maple Leaf Medical Center",
              "refId": "FC72",
              "salesRepId": 15
            },
            {
              "id": 73,
              "name": "Cascade General Hospital",
              "refId": "FC73",
              "salesRepId": 15
            },
            {
              "id": 74,
              "name": "Liberty Regional Health",
              "refId": "FC74",
              "salesRepId": 15
            },
            {
              "id": 75,
              "name": "Golden Valley Medical Center",
              "refId": "FC75",
              "salesRepId": 15
            },
            {
              "id": 76,
              "name": "Harmony Health Associates",
              "refId": "FC76",
              "salesRepId": 16
            },
            {
              "id": 77,
              "name": "Starlight Medical Center",
              "refId": "FC77",
              "salesRepId": 16
            },
            {
              "id": 78,
              "name": "Sunrise Health System",
              "refId": "FC78",
              "salesRepId": 16
            },
            {
              "id": 79,
              "name": "Clearwater Hospital Network",
              "refId": "FC79",
              "salesRepId": 16
            },
            {
              "id": 80,
              "name": "Tranquil Healthcare System",
              "refId": "FC80",
              "salesRepId": 16
            },
            {
              "id": 81,
              "name": "Willow Creek Medical Associates",
              "refId": "FC81",
              "salesRepId": 17
            },
            {
              "id": 82,
              "name": "Redwood Regional Hospital",
              "refId": "FC82",
              "salesRepId": 17
            },
            {
              "id": 83,
              "name": "Meadowbrook Medical Center",
              "refId": "FC83",
              "salesRepId": 17
            },
            {
              "id": 84,
              "name": "Twin Peaks Health Services",
              "refId": "FC84",
              "salesRepId": 17
            },
            {
              "id": 85,
              "name": "Cascade Healthcare Group",
              "refId": "FC85",
              "salesRepId": 17
            },
            {
              "id": 86,
              "name": "Pine Haven Hospital",
              "refId": "FC86",
              "salesRepId": 18
            },
            {
              "id": 87,
              "name": "Oceanview Medical Center",
              "refId": "FC87",
              "salesRepId": 18
            },
            {
              "id": 88,
              "name": "Summit Health Partners",
              "refId": "FC88",
              "salesRepId": 18
            },
            {
              "id": 89,
              "name": "Haven Healthcare System",
              "refId": "FC89",
              "salesRepId": 18
            },
            {
              "id": 90,
              "name": "Harborview Hospital Network",
              "refId": "FC90",
              "salesRepId": 18
            },
            {
              "id": 91,
              "name": "Valley Vista Healthcare",
              "refId": "FC91",
              "salesRepId": 19
            },
            {
              "id": 92,
              "name": "Phoenix Health Associates",
              "refId": "FC92",
              "salesRepId": 19
            },
            {
              "id": 93,
              "name": "Emerald City Medical Associates",
              "refId": "FC93",
              "salesRepId": 19
            },
            {
              "id": 94,
              "name": "Aspen Medical Center",
              "refId": "FC94",
              "salesRepId": 19
            },
            {
              "id": 95,
              "name": "Twin Lakes Healthcare Group",
              "refId": "FC95",
              "salesRepId": 19
            },
            {
              "id": 96,
              "name": "Willow Creek Health Services",
              "refId": "FC96",
              "salesRepId": 20
            },
            {
              "id": 97,
              "name": "Blue Ridge Regional Hospital",
              "refId": "FC97",
              "salesRepId": 20
            },
            {
              "id": 98,
              "name": "Mountain Crest Medical Center",
              "refId": "FC98",
              "salesRepId": 20
            },
            {
              "id": 99,
              "name": "Tranquil Health Associates",
              "refId": "FC99",
              "salesRepId": 20
            },
            {
              "id": 100,
              "name": "Harmony Healthcare Network",
              "refId": "FC100",
              "salesRepId": 20
            }
          ]).returning()
        console.log(data)
        console.log(title, "Data Seeded")
    }
}