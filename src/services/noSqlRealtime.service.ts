/**
 * Servicio: NoSqlRealtimeService
 * Fase 3 - Paso 3.1: Consumo en tiempo real basado en documentos (NoSQL / Firestore) (RA 5)
 * Implementa el patrón Observer con suscripciones reactivas (onSnapshot/subscribe).
 */

export interface LiveDocumentEvent {
  id: string;
  type: 'NEW_RECORD' | 'STATUS_CHANGE' | 'SECURITY_ALERT' | 'SYSTEM_SYNC';
  collection: 'enterprise_records' | 'audit_events' | 'system_nodes';
  title: string;
  description: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  meta?: Record<string, any>;
}

type Listener = (events: LiveDocumentEvent[]) => void;

class NoSqlRealtimeService {
  private events: LiveDocumentEvent[] = [];
  private listeners: Set<Listener> = new Set();
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private readonly STORAGE_KEY = 'NEXUS_NOSQL_LIVE_STREAM';

  constructor() {
    this.initDefaultEvents();
    this.startHeartbeat();
  }

  private initDefaultEvents() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.events = JSON.parse(stored);
        return;
      } catch {
        // Fallback
      }
    }

    this.events = [
      {
        id: 'doc-live-01',
        type: 'SYSTEM_SYNC',
        collection: 'system_nodes',
        title: 'Sincronización NoSQL Completada',
        description: 'Colección "enterprise_records" sincronizada con réplicas de base de datos distribuidas.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        priority: 'low'
      },
      {
        id: 'doc-live-02',
        type: 'NEW_RECORD',
        collection: 'enterprise_records',
        title: 'Nuevo Documento Ingestado',
        description: 'Expediente EXP-2026-001 almacenado en colección distribuida.',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        priority: 'medium'
      },
      {
        id: 'doc-live-03',
        type: 'STATUS_CHANGE',
        collection: 'enterprise_records',
        title: 'Actualización de Documento',
        description: 'Estado del documento cambiado a APROBADO por administrador.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        priority: 'high'
      }
    ];
    this.persist();
  }

  /**
   * Suscripción en tiempo real a la colección de eventos de documentos NoSQL.
   * Devuelve una función "unsubscribe" para evitar fugas de memoria en useEffect (ngOnDestroy).
   */
  public subscribeToLiveActivity(callback: Listener): () => void {
    this.listeners.add(callback);
    // Notificar inmediatamente el estado actual
    callback([...this.events]);

    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Emite un nuevo documento en tiempo real notificando a todos los observadores activos.
   */
  public emitDocumentEvent(
    type: LiveDocumentEvent['type'],
    title: string,
    description: string,
    priority: LiveDocumentEvent['priority'] = 'medium',
    meta?: Record<string, any>
  ): void {
    const newEvent: LiveDocumentEvent = {
      id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      collection: 'enterprise_records',
      title,
      description,
      timestamp: new Date().toISOString(),
      priority,
      meta
    };

    this.events = [newEvent, ...this.events.slice(0, 49)]; // Guardar los 50 más recientes
    this.persist();
    this.notify();
  }

  /**
   * Obtiene la instantánea síncrona actual de los documentos
   */
  public getSnapshot(): LiveDocumentEvent[] {
    return [...this.events];
  }

  /**
   * Limpia el feed de eventos
   */
  public clearLiveFeed(): void {
    this.events = [];
    this.persist();
    this.notify();
  }

  private notify() {
    const copy = [...this.events];
    this.listeners.forEach((listener) => {
      try {
        listener(copy);
      } catch (err) {
        console.error('Error en listener NoSQL:', err);
      }
    });
  }

  private persist() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.events));
    } catch {
      // Ignorar quota errors
    }
  }

  /**
   * Simula actividad periódica en tiempo real (heartbeat)
   */
  private startHeartbeat() {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      // Solo emitir si hay listeners activos
      if (this.listeners.size > 0 && Math.random() > 0.6) {
        const pingEvent: LiveDocumentEvent = {
          id: `ping-${Date.now()}`,
          type: 'SYSTEM_SYNC',
          collection: 'system_nodes',
          title: 'Heartbeat del Clúster NoSQL',
          description: `Latencia nodo primario: ${Math.floor(Math.random() * 20 + 8)}ms · Documentos indexados: ${this.events.length + 120}`,
          timestamp: new Date().toISOString(),
          priority: 'low'
        };
        this.events = [pingEvent, ...this.events.slice(0, 49)];
        this.persist();
        this.notify();
      }
    }, 25000); // Cada 25s
  }
}

export const noSqlRealtimeService = new NoSqlRealtimeService();
export default noSqlRealtimeService;
