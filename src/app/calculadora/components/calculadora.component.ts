import { Component, HostListener, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CalculadoraService } from '../services';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.scss'],
})
export class CalculadoraComponent implements OnInit {
  private numero1: string;
  private numero2: string;
  private resultado: number;
  private operador: string;
  pressioned: string;
  subscription: Subscription;

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.pressioned = null;
    this.getEventKey(event);
  }

  constructor(private calculadoraService: CalculadoraService) {}

  ngOnInit(): void {
    this.limpar();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getEventKey(event) {
    const number = parseFloat(event.key);
    const operators = ['-', '*', '/', '+'];
    this.pressioned = event.key;
    setTimeout(() => {
      this.pressioned = null;
    }, 100);

    if ((typeof number === 'number' && isFinite(number)) || event.key === '.') {
      this.adicionaNumero(number.toString());
    } else if (operators.indexOf(event.key) > -1) {
      this.definirOperacao(event.key);
    } else if (event.key === 'Enter') {
      this.calcular();
    } else if (event.key === 'Backspace') {
      if (this.numero2 === null) {
        this.numero1 = this.numero1.slice(0, -1);
        if (this.numero1 === '') this.numero1 = '0';
      } else {
        this.numero2 = this.numero2.slice(0, -1);
        if (this.numero2 === '') this.numero2 = '0';
      }
    } else if (event.key === 'Delete') {
      this.limpar();
    }
  }

  limpar(): void {
    this.numero1 = '0';
    this.numero2 = null;
    this.resultado = null;
    this.operador = null;
  }

  adicionaNumero(numero: string): void {
    if (this.operador === null) {
      this.numero1 = this.concatenarNumero(this.numero1, numero);
    } else {
      this.numero2 = this.concatenarNumero(this.numero2, numero);
    }
  }

  concatenarNumero(numeroAtual: string, numeroConcat: string): string {
    if (numeroAtual === '0' || numeroAtual === null) {
      numeroAtual = '';
    }

    if (numeroConcat === '.' && numeroAtual === '') {
      return '0.';
    }

    if (numeroConcat === '.' && numeroAtual.indexOf('.') > -1) {
      return numeroAtual;
    }

    return numeroAtual + numeroConcat;
  }

  definirOperacao(operador: string): void {
    if (this.operador === null) {
      this.operador = operador;
      return;
    }

    if (this.numero2 !== null) {
      this.resultado = this.calculadoraService.calcular(
        parseFloat(this.numero1),
        parseFloat(this.numero2),
        this.operador
      );
      this.operador = operador;
      this.numero1 = this.resultado.toString();
      this.numero2 = null;
      this.resultado = null;
    }
  }

  calcular(): void {
    if (this.numero2 === null) {
      return;
    }

    this.resultado = this.calculadoraService.calcular(
      parseFloat(this.numero1),
      parseFloat(this.numero2),
      this.operador
    );
  }

  get display(): string {
    if (this.resultado !== null) {
      return this.resultado.toString();
    }
    if (this.numero2 !== null) {
      return this.numero2;
    }
    return this.numero1;
  }
}
