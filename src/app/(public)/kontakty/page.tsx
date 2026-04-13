import { FC } from 'react';

import { ContactsView } from '@/views/contacts/server';

export const dynamic = 'force-static';

const ContactsPage: FC = () => <ContactsView />;

export default ContactsPage;
