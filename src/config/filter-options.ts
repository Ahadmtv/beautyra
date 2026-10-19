// TODO(backend): replace with city and neighborhood data from the API once it exists (docs/backend-gaps.md, item 5).
export const CITY_OPTIONS = [
  { value: "tehran", label: "تهران" },
  { value: "karaj", label: "کرج" },
  { value: "isfahan", label: "اصفهان" },
];

// TODO(backend): neighborhoods should depend on the selected city once the API provides them.
export const NEIGHBORHOOD_OPTIONS = [
  { value: "vanak", label: "ونک" },
  { value: "mirdamad", label: "میرداماد" },
  { value: "saadat-abad", label: "سعادت‌آباد" },
];
