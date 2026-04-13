import { DatabaseZap } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

import { GuideDashboardShellTemplate } from './guide-dashboard-shell';

export function GuideCrmPageTemplate() {
  return (
    <GuideDashboardShellTemplate
      activeItem='crm'
      title='CRM'
      subtitle='Заглушка под будущий функционал.'
    >
      <Card className='mx-auto mt-10 max-w-2xl rounded-3xl border-dashed border-border/60 bg-card/60 py-10 text-center'>
        <CardHeader>
          <div className='mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/12'>
            <DatabaseZap className='size-7 text-primary' />
          </div>
          <CardTitle className='text-2xl'>CRM в разработке</CardTitle>
          <CardDescription className='text-base'>
            Здесь можно будет собрать клиентов, сегменты, заметки, теги и историю коммуникаций.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className='rounded-xl'>Добавить первый блок позже</Button>
        </CardContent>
      </Card>
    </GuideDashboardShellTemplate>
  );
}

