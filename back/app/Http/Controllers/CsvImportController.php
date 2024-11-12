<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CsvImportController extends Controller
{
    
    // Método para cargar el archivo CSV
    public function showForm()
    {
        return view('csv-import');
    }


    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt'
        ]);
        Excel::import(new UsersImport, $request->file('file'));

        return back()->with('success', 'Datos importados con éxito!');
    }
}
