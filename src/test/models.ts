export interface ValidatorModel {
    id: string,
    name: string,
    description: string,
    website: string,
}

export interface InfoList {
    name: string;
    website: string;
    source_code: string;
    whitepaper: string;
    explorers: Explorer[];
    socials: Social[];
    details: Detail[];
    data_source: string;
  }
  
  interface Detail {
    language: string;
    description: string;
  }

  interface Social {
    name: string;
    url: string;
    handle: string;
  }
  
  interface Explorer {
    name: string;
    url: string;
  }
  

