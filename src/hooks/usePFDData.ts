import { useState, useMemo } from 'react';
import { TEST_CASE_A, TEST_CASE_B } from '@/constants/testCases';
import { runValidation } from '@/lib/validationEngine';
import type { PFDModel } from '@/types/pfd';

export function usePFDData() {
  const [activeTestCase, setActiveTestCase] = useState<'TC-A' | 'TC-B'>('TC-A');
  const [isValidated, setIsValidated] = useState(false);

  const baseModel: PFDModel = activeTestCase === 'TC-A' ? TEST_CASE_A : TEST_CASE_B;

  const model = useMemo<PFDModel>(() => {
    if (!isValidated) return { ...baseModel, validationResults: [] };
    const results = runValidation(baseModel);
    return { ...baseModel, validationResults: results };
  }, [activeTestCase, isValidated]);

  const validate = () => setIsValidated(true);
  const reset = () => setIsValidated(false);

  const switchTestCase = (id: 'TC-A' | 'TC-B') => {
    setActiveTestCase(id);
    setIsValidated(false);
  };

  const stats = useMemo(() => {
    const r = model.validationResults;
    return {
      passed: r.filter(v => v.status === 'passed').length,
      autofixed: r.filter(v => v.status === 'autofixed').length,
      warnings: r.filter(v => v.status === 'warning').length,
      failed: r.filter(v => v.status === 'failed').length,
      total: r.length,
    };
  }, [model.validationResults]);

  return { model, activeTestCase, isValidated, validate, reset, switchTestCase, stats };
}
