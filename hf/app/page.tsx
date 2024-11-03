'use client'

import { useState } from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar"
import AutoSpeech from './auto-speech/page'
import RemoveImageBackground from './remove-image-background/page'

export default function AppLayout() {
  const [activeCategory, setActiveCategory] = useState('AutoSpeech')

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Categories</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveCategory('AutoSpeech')}
                      isActive={activeCategory === 'AutoSpeech'}
                    >
                      AutoSpeech
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveCategory('RemoveImageBackground')}
                      isActive={activeCategory === 'RemoveImageBackground'}
                    >
                      Remove Image Background
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-6 overflow-auto">
          {activeCategory === 'AutoSpeech' && <AutoSpeech />}
          {activeCategory === 'RemoveImageBackground' && <RemoveImageBackground />}
        </main>
      </div>
    </SidebarProvider>
  )
}