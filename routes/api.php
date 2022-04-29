<?php

use App\Http\Controllers\ProductController;
use App\Models\Product;
use Illuminate\Support\Facades\Route;

// Route::get('products',[ProductController::class,'index']);
// Route::post('products',[ProductController::class,'store']);
// Route::get('products/{id}',[ProductController::class,'show']);
// Route::put('products/{id}',[ProductController::class,'update']);
// Route::delete('products/{id}',[ProductController::class,'destroy']);

Route::apiResource('products', ProductController::class);
