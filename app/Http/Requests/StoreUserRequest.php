<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Please enter a name.',
            'email.required' => 'Please enter an email address.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email is already taken.',
            'password.required' => 'Please enter a password.',
            'password.min' => 'Password must be at least 8 characters.',
        ];
    }
}
