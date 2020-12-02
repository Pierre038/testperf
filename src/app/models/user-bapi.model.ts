export interface UserBapi {
  identification: Identification;
  communication: Communication;
  links?: Links;
}

export interface PersonId {
  id: string;
  entityCode: string;
}

export interface LegalSituation {
  code: string;
  label: string;
}

export interface PersonStatus {
  code: string;
  label: string;
}

export interface AgencyId {
  id: string;
  entityCode: string;
}

export interface Agency {
  agencyId: AgencyId;
  label: string;
}

export interface AdvisorId {
  id: string;
  entityCode: string;
}

export interface Advisor {
  advisorId: AdvisorId;
  label: string;
}

export interface RelationType {
  code: string;
  label: string;
}

export interface Identification {
  personId?: PersonId;
  firstName: string;
  lastName: string;
  birthDate: string;
  civility: Civility;
  legalSituation?: LegalSituation;
  label?: string;
  personStatus?: PersonStatus;
  firstContactDate?: string;
  agency?: Agency;
  advisor?: Advisor;
  relationType?: RelationType;
}

export interface AdressId {
  id: string;
  entityCode: string;
}
export interface AdressType {
  code: string;
  label: string;
}

export interface AdressLocation {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
}

export interface Adress {
  location: AdressLocation;
  postalCode: string;
  countryIso2: string;
}

export interface AdressIdentification {
  adressId: AdressId;
  adressType: AdressType;
  adress: Adress;
  town: string;
  townLabel: string;
}

export interface PostalAdress {
  adressIdentification: AdressIdentification;
}

export interface Communication {
  phoneNumber: string;
  email: string;
  postalAdress?: PostalAdress;
}

export interface Link {
  href: string;
}
export interface Links {
  physicalPersonLink: Link;
  self: Link;
}

export interface Civility {
  code: string;
  label: string;
}

export const CIVILITY_MR: Civility = { code: '1', label: 'Monsieur' };
export const CIVILITY_MME: Civility = { code: '3', label: 'Madame' };
