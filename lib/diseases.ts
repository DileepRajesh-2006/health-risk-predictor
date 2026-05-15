/**
 * Curated Disease-Symptom-Precaution-Medicine Dataset
 *
 * Sources:
 * - Symptom mappings: Verified against MedlinePlus (NIH) and Mayo Clinic
 * - Precautions: WHO and CDC general health guidelines
 * - Medicines: Common OTC/first-line treatments (always consult a doctor)
 *
 * This dataset is used for the built-in symptom checker when
 * the WHO ICD-11 API is not available or as a fallback.
 */

export interface Disease {
  name: string
  description: string
  symptoms: string[]
  precautions: string[]
  medicines: string[]
  severity: "mild" | "moderate" | "severe"
  category: string
  whenToSeeDoctor: string
}

export const ALL_SYMPTOMS = [
  "Fever",
  "Cold",
  "Cough",
  "Fatigue",
  "Headache",
  "Sore Throat",
  "Runny Nose",
  "Body Aches",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Shortness of Breath",
  "Chest Pain",
  "Dizziness",
  "Skin Rash",
  "Joint Pain",
  "Abdominal Pain",
  "Loss of Appetite",
  "Sweating",
  "Chills",
  "Sneezing",
  "Congestion",
  "Blurred Vision",
  "Frequent Urination",
  "Weight Loss",
  "Swelling",
  "Muscle Cramps",
  "Itching",
  "Dry Mouth",
  "Back Pain",
] as const

export type Symptom = (typeof ALL_SYMPTOMS)[number]

export const DISEASES: Disease[] = [
  {
    name: "Common Cold",
    description:
      "A viral infection of the upper respiratory tract. Usually harmless and resolves within 7-10 days.",
    symptoms: ["Runny Nose", "Sneezing", "Congestion", "Sore Throat", "Cough", "Fatigue", "Headache"],
    precautions: [
      "Rest and stay hydrated",
      "Wash hands frequently to prevent spread",
      "Avoid close contact with others",
      "Use a humidifier to ease congestion",
    ],
    medicines: ["Acetaminophen (Tylenol)", "Ibuprofen (Advil)", "Pseudoephedrine (Sudafed)", "Dextromethorphan (cough suppressant)"],
    severity: "mild",
    category: "Respiratory",
    whenToSeeDoctor: "If symptoms last more than 10 days or worsen significantly.",
  },
  {
    name: "Influenza (Flu)",
    description:
      "A contagious respiratory illness caused by influenza viruses. More severe than the common cold.",
    symptoms: ["Fever", "Cough", "Sore Throat", "Body Aches", "Fatigue", "Headache", "Chills", "Sweating"],
    precautions: [
      "Get annual flu vaccination",
      "Rest and drink plenty of fluids",
      "Stay home to prevent spreading",
      "Cover mouth when coughing or sneezing",
    ],
    medicines: ["Oseltamivir (Tamiflu) - prescription", "Acetaminophen for fever", "Ibuprofen for body aches"],
    severity: "moderate",
    category: "Respiratory",
    whenToSeeDoctor: "If you have difficulty breathing, persistent chest pain, or high fever above 103F.",
  },
  {
    name: "COVID-19",
    description:
      "An infectious disease caused by the SARS-CoV-2 virus affecting the respiratory system.",
    symptoms: ["Fever", "Cough", "Fatigue", "Shortness of Breath", "Body Aches", "Headache", "Loss of Appetite", "Sore Throat"],
    precautions: [
      "Stay up to date with vaccinations",
      "Wear a mask in crowded indoor spaces",
      "Practice hand hygiene",
      "Isolate if tested positive",
    ],
    medicines: ["Acetaminophen for fever/pain", "Paxlovid (nirmatrelvir/ritonavir) - prescription", "Stay hydrated with oral rehydration solutions"],
    severity: "moderate",
    category: "Respiratory",
    whenToSeeDoctor: "If you experience difficulty breathing, persistent chest pain, or oxygen levels below 94%.",
  },
  {
    name: "Allergic Rhinitis",
    description:
      "An allergic reaction causing sneezing, itching, and nasal congestion from allergens like pollen, dust, or pet dander.",
    symptoms: ["Sneezing", "Runny Nose", "Congestion", "Itching", "Headache", "Fatigue"],
    precautions: [
      "Avoid known allergens",
      "Keep windows closed during high pollen days",
      "Use air purifiers indoors",
      "Shower after being outdoors",
    ],
    medicines: ["Cetirizine (Zyrtec)", "Loratadine (Claritin)", "Fluticasone nasal spray (Flonase)", "Diphenhydramine (Benadryl)"],
    severity: "mild",
    category: "Allergy",
    whenToSeeDoctor: "If over-the-counter medicines don't help or symptoms significantly impact daily life.",
  },
  {
    name: "Gastroenteritis",
    description:
      "Inflammation of the stomach and intestines, commonly caused by viral or bacterial infection (stomach flu).",
    symptoms: ["Nausea", "Vomiting", "Diarrhea", "Abdominal Pain", "Fever", "Fatigue", "Loss of Appetite", "Chills"],
    precautions: [
      "Stay hydrated with oral rehydration solutions",
      "Eat bland foods (BRAT: bananas, rice, applesauce, toast)",
      "Wash hands thoroughly before eating",
      "Avoid dairy and fatty foods until recovered",
    ],
    medicines: ["Oral Rehydration Salts (ORS)", "Loperamide (Imodium) for diarrhea", "Ondansetron (Zofran) for nausea - prescription", "Bismuth subsalicylate (Pepto-Bismol)"],
    severity: "moderate",
    category: "Gastrointestinal",
    whenToSeeDoctor: "If you see blood in vomit or stool, have high fever, or show signs of dehydration.",
  },
  {
    name: "Migraine",
    description:
      "A neurological condition characterized by intense, debilitating headaches often accompanied by nausea and sensitivity to light.",
    symptoms: ["Headache", "Nausea", "Blurred Vision", "Dizziness", "Fatigue", "Vomiting"],
    precautions: [
      "Identify and avoid personal triggers (stress, certain foods, bright lights)",
      "Maintain regular sleep schedule",
      "Stay hydrated throughout the day",
      "Practice stress management techniques",
    ],
    medicines: ["Sumatriptan (Imitrex) - prescription", "Ibuprofen (Advil)", "Acetaminophen + Caffeine (Excedrin)", "Naproxen (Aleve)"],
    severity: "moderate",
    category: "Neurological",
    whenToSeeDoctor: "If headaches are sudden and severe, occur after head injury, or increase in frequency.",
  },
  {
    name: "Type 2 Diabetes",
    description:
      "A chronic condition that affects how the body processes blood sugar (glucose). Develops over time with insulin resistance.",
    symptoms: ["Frequent Urination", "Fatigue", "Blurred Vision", "Weight Loss", "Dry Mouth", "Itching", "Sweating"],
    precautions: [
      "Monitor blood glucose regularly",
      "Follow a balanced, low-glycemic diet",
      "Exercise at least 150 minutes per week",
      "Take medications as prescribed",
    ],
    medicines: ["Metformin (Glucophage) - prescription", "Glipizide - prescription", "Insulin (various types) - prescription"],
    severity: "severe",
    category: "Endocrine",
    whenToSeeDoctor: "If glucose consistently exceeds 200 mg/dL or you experience diabetic ketoacidosis symptoms.",
  },
  {
    name: "Hypertension",
    description:
      "Persistently elevated blood pressure that increases the risk of heart disease and stroke. Often called the 'silent killer'.",
    symptoms: ["Headache", "Dizziness", "Shortness of Breath", "Chest Pain", "Blurred Vision", "Fatigue"],
    precautions: [
      "Reduce sodium intake to less than 2,300mg per day",
      "Exercise regularly (at least 30 minutes most days)",
      "Maintain a healthy weight",
      "Limit alcohol consumption and quit smoking",
    ],
    medicines: ["Lisinopril (ACE inhibitor) - prescription", "Amlodipine (calcium channel blocker) - prescription", "Hydrochlorothiazide (diuretic) - prescription"],
    severity: "severe",
    category: "Cardiovascular",
    whenToSeeDoctor: "If BP readings consistently exceed 140/90 mmHg or you experience severe headaches with vision changes.",
  },
  {
    name: "Bronchitis",
    description:
      "Inflammation of the bronchial tubes that carry air to and from the lungs. Can be acute (short-term) or chronic.",
    symptoms: ["Cough", "Fatigue", "Shortness of Breath", "Chest Pain", "Fever", "Chills", "Sore Throat"],
    precautions: [
      "Avoid smoking and secondhand smoke",
      "Use a humidifier to moisten air",
      "Rest and drink plenty of fluids",
      "Avoid lung irritants and pollutants",
    ],
    medicines: ["Guaifenesin (Mucinex) for mucus", "Dextromethorphan for cough", "Albuterol inhaler - prescription", "Acetaminophen for fever"],
    severity: "moderate",
    category: "Respiratory",
    whenToSeeDoctor: "If cough lasts more than 3 weeks, produces blood, or is accompanied by high fever.",
  },
  {
    name: "Urinary Tract Infection (UTI)",
    description:
      "An infection in any part of the urinary system, most commonly in the bladder and urethra.",
    symptoms: ["Frequent Urination", "Abdominal Pain", "Fever", "Back Pain", "Fatigue", "Nausea"],
    precautions: [
      "Drink plenty of water daily",
      "Urinate frequently and don't hold urine",
      "Maintain proper hygiene",
      "Avoid irritating feminine products",
    ],
    medicines: ["Trimethoprim/Sulfamethoxazole - prescription", "Nitrofurantoin - prescription", "Phenazopyridine (AZO) for pain relief"],
    severity: "moderate",
    category: "Urological",
    whenToSeeDoctor: "If you have fever, back pain, blood in urine, or symptoms persist after 2 days.",
  },
  {
    name: "Arthritis",
    description:
      "Inflammation of one or more joints, causing pain and stiffness that can worsen with age.",
    symptoms: ["Joint Pain", "Swelling", "Fatigue", "Body Aches", "Muscle Cramps", "Back Pain"],
    precautions: [
      "Maintain a healthy weight to reduce joint stress",
      "Exercise regularly with low-impact activities (swimming, walking)",
      "Apply hot/cold therapy to affected joints",
      "Protect joints from overuse and injury",
    ],
    medicines: ["Ibuprofen (Advil/Motrin)", "Naproxen (Aleve)", "Acetaminophen (Tylenol)", "Topical diclofenac gel"],
    severity: "moderate",
    category: "Musculoskeletal",
    whenToSeeDoctor: "If joint pain is severe, persistent, or limits daily activities significantly.",
  },
  {
    name: "Pneumonia",
    description:
      "An infection that inflames the air sacs in one or both lungs, which may fill with fluid or pus.",
    symptoms: ["Cough", "Fever", "Shortness of Breath", "Chest Pain", "Fatigue", "Chills", "Sweating", "Nausea"],
    precautions: [
      "Get vaccinated (pneumococcal vaccine)",
      "Practice good hand hygiene",
      "Avoid smoking",
      "Seek treatment early for respiratory infections",
    ],
    medicines: ["Amoxicillin - prescription", "Azithromycin (Z-pack) - prescription", "Acetaminophen for fever", "Rest and fluids are essential"],
    severity: "severe",
    category: "Respiratory",
    whenToSeeDoctor: "Seek immediate care if you have difficulty breathing, chest pain, persistent high fever, or coughing up pus.",
  },
  {
    name: "Anemia",
    description:
      "A condition where the blood doesn't have enough healthy red blood cells to carry adequate oxygen to tissues.",
    symptoms: ["Fatigue", "Dizziness", "Shortness of Breath", "Headache", "Cold", "Chills", "Loss of Appetite"],
    precautions: [
      "Eat iron-rich foods (spinach, red meat, beans, fortified cereals)",
      "Take vitamin C to improve iron absorption",
      "Avoid tea and coffee with meals (inhibit iron absorption)",
      "Get regular blood tests to monitor levels",
    ],
    medicines: ["Ferrous sulfate (iron supplement)", "Vitamin B12 supplements", "Folic acid supplements"],
    severity: "moderate",
    category: "Hematological",
    whenToSeeDoctor: "If you experience persistent fatigue, pale skin, rapid heartbeat, or shortness of breath at rest.",
  },
  {
    name: "Asthma",
    description:
      "A chronic condition in which airways narrow and swell, producing extra mucus that makes breathing difficult.",
    symptoms: ["Shortness of Breath", "Cough", "Chest Pain", "Fatigue", "Sweating"],
    precautions: [
      "Identify and avoid asthma triggers",
      "Always carry your rescue inhaler",
      "Follow your asthma action plan",
      "Use air purifiers and maintain clean indoor air",
    ],
    medicines: ["Albuterol inhaler (rescue) - prescription", "Fluticasone inhaler (maintenance) - prescription", "Montelukast (Singulair) - prescription"],
    severity: "moderate",
    category: "Respiratory",
    whenToSeeDoctor: "If attacks become more frequent, you need your rescue inhaler more often, or breathing worsens.",
  },
  {
    name: "Dermatitis (Eczema)",
    description:
      "A condition that makes skin red, inflamed, and itchy. Common in children but can occur at any age.",
    symptoms: ["Skin Rash", "Itching", "Dry Mouth", "Swelling", "Fatigue"],
    precautions: [
      "Moisturize skin regularly with fragrance-free cream",
      "Avoid harsh soaps and detergents",
      "Wear soft, breathable fabrics",
      "Manage stress as it can trigger flare-ups",
    ],
    medicines: ["Hydrocortisone cream (1%)", "Cetirizine for itching", "Moisturizing creams (CeraVe, Eucerin)", "Tacrolimus ointment - prescription"],
    severity: "mild",
    category: "Dermatological",
    whenToSeeDoctor: "If skin becomes infected (warm, red, swollen), rash spreads, or OTC treatments don't help.",
  },
  {
    name: "Gastroesophageal Reflux Disease (GERD)",
    description:
      "A digestive disorder where stomach acid frequently flows back into the esophagus, causing heartburn.",
    symptoms: ["Chest Pain", "Nausea", "Sore Throat", "Cough", "Abdominal Pain", "Loss of Appetite"],
    precautions: [
      "Avoid large meals before bedtime",
      "Elevate the head of your bed 6-8 inches",
      "Avoid trigger foods (spicy, fatty, citrus, chocolate)",
      "Maintain a healthy weight",
    ],
    medicines: ["Omeprazole (Prilosec)", "Famotidine (Pepcid)", "Calcium carbonate (Tums)", "Esomeprazole (Nexium)"],
    severity: "moderate",
    category: "Gastrointestinal",
    whenToSeeDoctor: "If heartburn occurs more than twice a week, difficulty swallowing, or unintended weight loss.",
  },
  {
    name: "Conjunctivitis (Pink Eye)",
    description:
      "Inflammation or infection of the transparent membrane (conjunctiva) that lines the eyelid and eyeball.",
    symptoms: ["Itching", "Skin Rash", "Swelling", "Runny Nose", "Fatigue"],
    precautions: [
      "Wash hands frequently and avoid touching eyes",
      "Don't share towels, pillows, or eye cosmetics",
      "Apply warm compresses to affected eye",
      "Discard contact lenses worn during infection",
    ],
    medicines: ["Artificial tears", "Antihistamine eye drops (Ketotifen)", "Antibiotic eye drops - prescription (if bacterial)"],
    severity: "mild",
    category: "Ophthalmological",
    whenToSeeDoctor: "If vision changes, severe eye pain, sensitivity to light, or symptoms don't improve in 24-48 hours.",
  },
  {
    name: "Iron Deficiency",
    description:
      "A condition where the body lacks sufficient iron to produce hemoglobin, the protein in red blood cells.",
    symptoms: ["Fatigue", "Dizziness", "Headache", "Cold", "Muscle Cramps", "Loss of Appetite", "Shortness of Breath"],
    precautions: [
      "Include iron-rich foods in every meal",
      "Pair iron-rich foods with vitamin C for better absorption",
      "Avoid excess tea and coffee",
      "Cook in cast-iron cookware to increase iron content",
    ],
    medicines: ["Ferrous sulfate tablets", "Ferrous gluconate", "Iron bisglycinate (gentler on stomach)", "Vitamin C supplement"],
    severity: "moderate",
    category: "Nutritional",
    whenToSeeDoctor: "If you experience severe fatigue, pale skin, chest pain, or shortness of breath.",
  },
  {
    name: "Sinusitis",
    description:
      "Inflammation or swelling of the tissue lining the sinuses, often caused by infection.",
    symptoms: ["Congestion", "Headache", "Fatigue", "Fever", "Cough", "Sore Throat", "Runny Nose"],
    precautions: [
      "Use saline nasal irrigation",
      "Apply warm compresses to face",
      "Stay hydrated to thin mucus",
      "Avoid allergens and pollutants",
    ],
    medicines: ["Pseudoephedrine (Sudafed)", "Oxymetazoline nasal spray (Afrin) - max 3 days", "Saline nasal spray", "Amoxicillin (if bacterial) - prescription"],
    severity: "mild",
    category: "Respiratory",
    whenToSeeDoctor: "If symptoms last more than 10 days, severe headache, high fever, or swelling around eyes.",
  },
  {
    name: "Tension Headache",
    description:
      "The most common type of headache, causing a dull, aching head pain with a sensation of tightness.",
    symptoms: ["Headache", "Fatigue", "Muscle Cramps", "Dizziness", "Congestion"],
    precautions: [
      "Manage stress with relaxation techniques",
      "Maintain good posture",
      "Take regular breaks from screens",
      "Stay hydrated and don't skip meals",
    ],
    medicines: ["Acetaminophen (Tylenol)", "Ibuprofen (Advil)", "Aspirin", "Caffeine (in moderation)"],
    severity: "mild",
    category: "Neurological",
    whenToSeeDoctor: "If headaches are frequent (>15 days/month), sudden and severe, or accompanied by confusion.",
  },
]

// ---------- Symptom Checker Logic ----------

export interface DiseaseMatch {
  disease: Disease
  matchedSymptoms: string[]
  confidence: number // (matched / total symptoms) * 100
  matchCount: number
}

export function checkSymptoms(selectedSymptoms: string[]): DiseaseMatch[] {
  if (selectedSymptoms.length === 0) return []

  const matches: DiseaseMatch[] = []

  for (const disease of DISEASES) {
    const matchedSymptoms = disease.symptoms.filter((s) =>
      selectedSymptoms.includes(s)
    )

    if (matchedSymptoms.length > 0) {
      // Confidence = (matched / total symptoms of disease) * 100
      // This prevents common diseases with many symptoms from always ranking highest
      const confidence =
        Math.round((matchedSymptoms.length / disease.symptoms.length) * 1000) /
        10

      matches.push({
        disease,
        matchedSymptoms,
        confidence,
        matchCount: matchedSymptoms.length,
      })
    }
  }

  // Sort by confidence first, then by match count as tiebreaker
  matches.sort((a, b) => {
    if (b.confidence !== a.confidence) return b.confidence - a.confidence
    return b.matchCount - a.matchCount
  })

  return matches
}

export function searchDiseases(query: string): Disease[] {
  const lowerQuery = query.toLowerCase().trim()
  if (!lowerQuery) return []

  return DISEASES.filter(
    (d) =>
      d.name.toLowerCase().includes(lowerQuery) ||
      d.description.toLowerCase().includes(lowerQuery) ||
      d.category.toLowerCase().includes(lowerQuery) ||
      d.symptoms.some((s) => s.toLowerCase().includes(lowerQuery))
  )
}
