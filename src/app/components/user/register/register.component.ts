import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public errorMessage!: string;

  public email!: string;
  public password!: string;
  public showPassword: boolean = false;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  public form!: FormGroup;
  get vendaValidator(): any { return this.form.controls; }

  constructor(
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.validation();
  }

  public registrarUsuario() {
    this.spinner.show();
    const dados = {
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value
    };

    this.userService.register(dados).subscribe({
      next: () => {
        this.spinner.hide();
        this.router.navigateByUrl('/dashboard');
        this.form.reset();

      },
      error: () => {
        this.spinner.hide();
        this.errorMessage = 'Falha ao tentar registrar, verifique seus dados.'
      }
    });
  }

  public togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    if (this.showPassword) {
      this.passwordInput.nativeElement.setAttribute('type', 'text');

    } else {
      this.passwordInput.nativeElement.setAttribute('type', 'password');
    }
  }

  public validation(): void {
    this.form = this.fb.group(
      {
        email: ['', [
          Validators.required,
          Validators.email,
          Validators.maxLength(30)
        ]],
        password: ['', [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/[0-9]/),
          Validators.pattern(/[a-z]/),
          Validators.pattern(/[A-Z]/),
          Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$/), // senha tenha pelo menos um número, uma letra minúscula, uma letra maiúscula e um caractere não alfanumérico
          this.hasUniqueChar,
        ]],
      }
    )
  }

  // Função de validação para verificar se há pelo menos 1 caractere diferente
  public hasUniqueChar(control: AbstractControl): ValidationErrors | null {
    if(control?.value === ''){
      return null;
    }
    const uniqueChars = [...new Set(control?.value?.split(''))];
    return uniqueChars.length > 1 ? null : { hasUniqueChar: true };
  }

}
