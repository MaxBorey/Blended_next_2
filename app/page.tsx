'use client';

import Section from '@/components/Section/Section';
import Container from '@/components/Container/Container';
import Heading from '@/components/Heading/Heading';
import ExchangeForm from '@/components/ExchangeForm/ExchangeForm'; 

import css from './page.module.css';

export default function Home() {
  return (
    <main className={css.main}>
      <Section>
        <Container>
          <Heading  info title="Enter the amount of money you want to exchange?🙂" error={false} />
          <ExchangeForm />  
        </Container>
      </Section>
    </main>
  );
}
