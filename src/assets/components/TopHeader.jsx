import React from 'react'
import { Mail, Phone } from 'lucide-react';

function TopHeader() {
  return (
    <>
    {/* Top Bar */}
      <div className="bg-[#203F9A] text-white text-sm py-1 px-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0">
        <div className="hidden lg:flex items-center space-x-2 justify-center md:justify-start">
            <span className="h-2 w-2 bg-red-500 rounded-full inline-block" />
            <span>We are ready 24 Hours</span>
        </div>
        <div className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-6 justify-center md:justify-end">
            <div className="flex items-center space-x-1">
            <Phone className="w-4 h-4" />
            <span>Fast Service: <a href="tel:08117256648" className="text-blue-300 ">(+234) 08117256648</a></span>
            </div>
            <div className="flex items-center space-x-1">
            <Mail className="w-4 h-4" />
            <a href="mailto:infohomepro@mail.com" className="text-white">info@itservicepro.com</a>
            </div>
        </div>
    </div>
    </>
  )
}

export default TopHeader

