import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <div class="flex justify-center">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">E</span>
            </div>
          </div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Or
            <a routerLink="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </a>
          </p>
        </div>

        <form class="mt-8 space-y-6" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          @if (errorMessage()) {
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" [innerHTML]="errorMessage()">
            </div>
          }

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
                <input id="firstName" 
                       name="firstName" 
                       type="text" 
                       formControlName="firstName"
                       class="form-input mt-1"
                       placeholder="First name">
                @if (registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched) {
                  <p class="mt-1 text-sm text-red-600">First name is required</p>
                }
              </div>

              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
                <input id="lastName" 
                       name="lastName" 
                       type="text" 
                       formControlName="lastName"
                       class="form-input mt-1"
                       placeholder="Last name">
                @if (registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched) {
                  <p class="mt-1 text-sm text-red-600">Last name is required</p>
                }
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
              <input id="email" 
                     name="email" 
                     type="email" 
                     formControlName="email"
                     class="form-input mt-1"
                     placeholder="Enter your email">
              @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
                <p class="mt-1 text-sm text-red-600">Please enter a valid email address</p>
              }
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
              <input id="phone" 
                     name="phone" 
                     type="tel" 
                     formControlName="phone"
                     class="form-input mt-1"
                     placeholder="Enter your phone number">
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <input id="password" 
                     name="password" 
                     type="password" 
                     formControlName="password"
                     class="form-input mt-1"
                     placeholder="Create a password">
              @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                <p class="mt-1 text-sm text-red-600">Password must be at least 6 characters</p>
              }
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input id="confirmPassword" 
                     name="confirmPassword" 
                     type="password" 
                     formControlName="confirmPassword"
                     class="form-input mt-1"
                     placeholder="Confirm your password">
              @if (registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched) {
                <p class="mt-1 text-sm text-red-600">Passwords do not match</p>
              }
            </div>
          </div>

          <div class="flex items-center">
            <input id="terms" 
                   name="terms" 
                   type="checkbox" 
                   formControlName="terms"
                   class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
            <label for="terms" class="ml-2 block text-sm text-gray-900">
              I agree to the 
              <a href="#" class="text-blue-600 hover:text-blue-500">Terms and Conditions</a>
              and 
              <a href="#" class="text-blue-600 hover:text-blue-500">Privacy Policy</a>
            </label>
          </div>
          @if (registerForm.get('terms')?.invalid && registerForm.get('terms')?.touched) {
            <p class="text-sm text-red-600">You must agree to the terms and conditions</p>
          }

          <div>
            <button type="submit" 
                    [disabled]="registerForm.invalid || isLoading()"
                    class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
              @if (isLoading()) {
                <div class="spinner w-5 h-5 mr-2"></div>
                Creating account...
              } @else {
                Create Account
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const { confirmPassword, terms, ...userData } = this.registerForm.value;
      console.log('Sending registration data:', userData);

      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.isLoading.set(false);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.isLoading.set(false);
          
          if (error.message === 'User already exists') {
            this.errorMessage.set(
              `An account with this email already exists. Please 
              <a routerLink="/auth/login" class="text-blue-600 hover:text-blue-500">sign in</a> 
              or use a different email address.`
            );
            // Clear the email field
            this.registerForm.get('email')?.setValue('');
            this.registerForm.get('email')?.markAsTouched();
          } else {
            this.errorMessage.set(
              error.message || 
              error.error?.message || 
              'Registration failed. Please try again.'
            );
          }
        }
      });
    } else {
      console.log('Form validation errors:', this.registerForm.errors);
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control?.errors) {
          console.log(`${key} validation errors:`, control.errors);
        }
      });
    }
  }
}