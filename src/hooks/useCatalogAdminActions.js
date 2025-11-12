'use client';

import { useMemo } from 'react';
import { createCatalogAdminClient } from '@/lib/services/catalogAdminClient';

export default function useCatalogAdminActions() {
  return useMemo(() => createCatalogAdminClient(), []);
}

