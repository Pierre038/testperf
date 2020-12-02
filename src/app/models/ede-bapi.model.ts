export interface EdeBapi {
  characteristics: {
    applicationId: string;
    userApplicationId: string;
    filename: string;
    depositCode: number;
    retentionEndDate: string | null;
    hashcode: string;
    token: string;
    uploadLinks: Links | null;
  };

  response: Response;
}

export interface Links {
  _links: {
    self: Link;
    download: Link[];
  };
}

export interface Link {
  href: string;
}

export interface Response {
  interactionId: string;
  code: string;
  label: string;
}
