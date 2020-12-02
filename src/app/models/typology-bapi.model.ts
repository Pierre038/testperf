export interface FamilySituationBapi {
  code: string;
  shortLabel?: string;
  label: string;
  links?: Link[];
}

export interface Link {
  href: string;
  rel: string;
}
