interface RealmAccess {
  roles: string[];
}

interface ResourceAccess {
  account: {
    roles: string[];
  };
}

// More specific JWT payload interface
export interface JwtPayload {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  sid: string;
  acr: string;
  allowedOrigins: string[];
  realmAccess: RealmAccess;
  resourceAccess: ResourceAccess;
  scope: string;
  emailVerified: boolean;
  name: string;
  preferredUsername: string;
  givenName: string;
  familyName: string;
  email: string;
}