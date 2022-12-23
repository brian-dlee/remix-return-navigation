import { createCookieSessionStorage, Session } from '@remix-run/node';

export interface OptionsCookieData {
  clientSideReturnLocationStorage: string;
  defaultReturnLocationStateKey: string;
  defaultReturnLocationSearchParam: string;
  useNavigateOnHydrate: boolean;
}

type RequestOrSession = Request | Session;

const optionsCookieStorage = createCookieSessionStorage({
  cookie: {
    name: 'options',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: true,
    // please never actually hardcode your secrets
    secrets: ['asupersecretsecret'],
  },
});

export async function getOptionsCookieData(requestOrSession: Request): Promise<OptionsCookieData> {
  const session = await getSession(requestOrSession);
  return {
    clientSideReturnLocationStorage:
      session.get('clientSideReturnLocationStorage') || 'locationState',
    defaultReturnLocationSearchParam: session.get('defaultReturnLocationSearchParam') || 'return',
    defaultReturnLocationStateKey: session.get('defaultReturnLocationStateKey') || 'returnLocation',
    useNavigateOnHydrate: session.get('useNavigateOnHydrate') !== false,
  };
}

export async function setOptionsCookieData(
  requestOrSession: RequestOrSession,
  data: Partial<OptionsCookieData>
): Promise<string> {
  const session = await getSession(requestOrSession);

  if ('clientSideReturnLocationStorage' in data) {
    session.set('clientSideReturnLocationStorage', data.clientSideReturnLocationStorage);
  }

  if ('defaultReturnLocationSearchParam' in data) {
    session.set('defaultReturnLocationSearchParam', data.defaultReturnLocationSearchParam);
  }

  if ('defaultReturnLocationStateKey' in data) {
    session.set('defaultReturnLocationStateKey', data.defaultReturnLocationStateKey);
  }

  if ('useNavigateOnHydrate' in data) {
    session.set('useNavigateOnHydrate', data.useNavigateOnHydrate);
  }

  return optionsCookieStorage.commitSession(session);
}

async function getSession(requestOrSession: RequestOrSession): Promise<Session> {
  return 'headers' in requestOrSession
    ? await optionsCookieStorage.getSession(requestOrSession.headers.get('Cookie'))
    : requestOrSession;
}
