<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UsersController extends Controller
{
    public function index(Request $request): Response
    {
        $search = (string) $request->string('search');
        $status = $request->string('status', '');
        $sort = $request->string('sort')->toString() ?: 'name';
        $direction = strtolower($request->string('direction')->toString() ?: 'asc');
        if (! in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'asc';
        }

        $query = User::query()
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('status'), function ($q) use ($status) {
                $q->where('status', $status);
            });


        $sortable = ['name', 'email', 'created_at'];
        if (! in_array($sort, $sortable, true)) {
            $sort = 'name';
        }

        $query->orderBy($sort, $direction);

        $users = $query->paginate(10)->withQueryString();
        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'status' => $status,
            ],
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $user = new User();
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->password = Hash::make($data['password']);
        $user->save();

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $data = $request->validated();

        $user->name = $data['name'];
        $user->email = $data['email'];
        if (! empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }
        $user->save();

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}
