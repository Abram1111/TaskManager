"use client";
import React from 'react';
import Tasklist from '../components/Tasklist';

export default function Home() {
  return (
    <main >
      <h1 style={{ color: "white", textAlign: "center" }}>
       Task Manager
      </h1> 
      <Tasklist />
     
    </main>
  );
}
