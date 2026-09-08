import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { createServiceClient } from '@/lib/supabase/service'
export async function GET(){try{await requireAdmin();const service=createServiceClient();const {data,error}=await service.from('media').select('*').order('created_at',{ascending:false});if(error)throw error;return NextResponse.json({files:data||[]})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Unable to load media.'},{status:500})}}
