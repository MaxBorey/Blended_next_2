'use client';

import React, { useState } from 'react';
import { RiExchangeDollarFill } from 'react-icons/ri';
import styles from './ExchangeForm.module.css';
import { useCurrencyStore } from '@/lib/stores/currencyStore';
import Heading from '@/components/Heading/Heading';
import Loader from '@/components/Loader/Loader';
import ExchangeInfo from '@/components/ExchangeInfo/ExchangeInfo';

const regex = /^\d+(\.\d{1,2})?\s[a-zA-Z]{3}\sin\s[a-zA-Z]{3}$/;

function parseInput(input: string) {
  const parts = input.trim().split(' ');
  const amount = parseFloat(parts[0]);
  const from = parts[1].toUpperCase();
  const to = parts[3].toUpperCase();
  return { amount, from, to };
}

export default function ExchangeForm() {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const { convert, exchangeInfo, isLoading, isError } = useCurrencyStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (!regex.test(val)) {
      setInputError('Invalid format. Expected: "15 USD in UAH"');
    } else {
      setInputError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regex.test(inputValue)) {
      setInputError('Please enter valid input before submitting.');
      return;
    }
    setInputError('');
    const { amount, from, to } = parseInput(inputValue);
    await convert(from, to, amount);
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="15 USD in UAH"
          title="Request format 15 USD in UAH"
          className={styles.input}
          name="currency"
          required
          aria-invalid={!!inputError}
          aria-describedby="error-message"
        />

        <button
          className={styles.button}
          type="submit"
          disabled={!!inputError || inputValue === ''}
          aria-label="Convert currency"
        >
          <RiExchangeDollarFill className={styles.icon} />
        </button>

        {inputError && (
          <p
            id="error-message"
            style={{ color: 'red', marginTop: '4px', paddingLeft: '10px' }}
          >
            {inputError}
          </p>
        )}
      </form>

      {isLoading && <Loader />}
      {exchangeInfo && (
        <ExchangeInfo
          amount={exchangeInfo.amount}
          from={exchangeInfo.from}
          to={exchangeInfo.to}
          rate={exchangeInfo.rate}
          result={exchangeInfo.result}
        />
      )}
      {isError && (
        <Heading
          error
          title="Something went wrong...😐 Check the data validity and try again!"
        />
      )}
    </>
  );
}
