import { Global, Module } from '@nestjs/common';
import { MemorySessionStore } from './store/memory.store';
import { MemoryPendingStore } from './pending/memory-pending.store';

export const SESSION_STORE = 'SESSION_STORE';
export const PENDING_STORE = 'PENDING_STORE';
@Global()
@Module({
  providers: [
    { provide: SESSION_STORE, useClass: MemorySessionStore },
    { provide: PENDING_STORE, useClass: MemoryPendingStore },
  ],
  exports: [SESSION_STORE, PENDING_STORE],
})
export class SessionModule {}
