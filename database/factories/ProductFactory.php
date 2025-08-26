<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(3, true),
            'description' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 1, 1000),
            'stock' => fake()->numberBetween(0, 1000),
            'is_active' => fake()->boolean(90),
        ];
    }
}
