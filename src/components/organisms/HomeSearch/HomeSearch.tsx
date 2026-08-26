'use client';

import React, { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import styles from './HomeSearch.module.css';
import { SearchBar } from '../../molecules/SearchBar/SearchBar';
import { Container } from '../../layout/Container/Container';

export const HomeSearch: React.FC = () => {
  const t = useTranslations('homepage');
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (value: string) => {
    if (!value.trim()) return;
    router.push(`/cases?q=${encodeURIComponent(value)}`);
  };

  return (
    <section className={styles.section}>
      <Container size="md">
        <div className={styles.wrapper}>
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={handleSearch}
            placeholder={t('searchPlaceholder')}
            size="lg"
            showVoiceInput={true}
          />
        </div>
      </Container>
    </section>
  );
};
