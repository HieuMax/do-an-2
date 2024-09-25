import React from 'react'
import { ListCard } from '../../components/card/ListCard'

const Home = () => {
  const card = [
    {name: "New 1", href: '/', activity: "Hoạt động của trường", title: "Nghiên cứu", content: "Nghien cuu vui ve", author: "Hieu Max", publishDate: "12/09/2024"},
    {name: "New 2", href: '/', activity: "Hoạt động của trường", title: "Nghiên cứu 2", content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora debitis necessitatibus iure, quo eveniet consequatur, illum maxime laboriosam et amet quos blanditiis ipsam porro enim sapiente iusto sed voluptates ut?`, author: "Hieu Max", publishDate: "12/09/2024"},
    {name: "New 3", href: '/', activity: "Hoạt động của trường", title: "Nghiên cứu 3", content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora debitis necessitatibus iure, quo eveniet consequatur, illum maxime laboriosam et amet quos blanditiis ipsam porro enim sapiente iusto sed voluptates ut?`, author: "Hieu Max", publishDate: "12/09/2024"},
    {name: "New 4", href: '/', activity: "Hoạt động của trường", title: "Nghiên cứu 4", content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora debitis necessitatibus iure, quo eveniet consequatur, illum maxime laboriosam et amet quos blanditiis ipsam porro enim sapiente iusto sed voluptates ut?`, author: "Hieu Max", publishDate: "12/09/2024"},
    {name: "New 5", href: '/', activity: "Hoạt động của trường", title: "Nghiên cứu 5", content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora debitis necessitatibus iure, quo eveniet consequatur, illum maxime laboriosam et amet quos blanditiis ipsam porro enim sapiente iusto sed voluptates ut?`, author: "Hieu Max", publishDate: "12/09/2024"},
    {name: "New 6", href: '/', activity: "Hoạt động của trường", title: "Nghiên cứu 6", content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora debitis necessitatibus iure, quo eveniet consequatur, illum maxime laboriosam et amet quos blanditiis ipsam porro enim sapiente iusto sed voluptates ut?`, author: "Hieu Max", publishDate: "12/09/2024"},
    {name: "New 7", href: '/', activity: "Hoạt động của trường", title: "Nghiên cứu 7", content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora debitis necessitatibus iure, quo eveniet consequatur, illum maxime laboriosam et amet quos blanditiis ipsam porro enim sapiente iusto sed voluptates ut?`, author: "Hieu Max", publishDate: "12/09/2024"},
    {name: "New 8", href: '/', activity: "Hoạt động của trường", title: "Nghiên cứu 8", content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora debitis necessitatibus iure, quo eveniet consequatur, illum maxime laboriosam et amet quos blanditiis ipsam porro enim sapiente iusto sed voluptates ut?`, author: "Hieu Max", publishDate: "12/09/2024"},
    {name: "New 9", href: '/', activity: "Hoạt động của trường", title: "Nghiên cứu 9", content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora debitis necessitatibus iure, quo eveniet consequatur, illum maxime laboriosam et amet quos blanditiis ipsam porro enim sapiente iusto sed voluptates ut?`, author: "Hieu Max", publishDate: "12/09/2024"},
    {name: "New 10", href: '/', activity: "Hoạt động của trường", title: "Nghiên cứu 10", content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora debitis necessitatibus iure, quo eveniet consequatur, illum maxime laboriosam et amet quos blanditiis ipsam porro enim sapiente iusto sed voluptates ut?`, author: "Hieu Max", publishDate: "12/09/2024"},
    {name: "New 11", href: '/', activity: "Hoạt động của trường", title: "Nghiên cứu 11", content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora debitis necessitatibus iure, quo eveniet consequatur, illum maxime laboriosam et amet quos blanditiis ipsam porro enim sapiente iusto sed voluptates ut?`, author: "Hieu Max", publishDate: "12/09/2024"},
    {name: "New 12", href: '/', activity: "Hoạt động của trường", title: "Nghiên cứu 12", content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora debitis necessitatibus iure, quo eveniet consequatur, illum maxime laboriosam et amet quos blanditiis ipsam porro enim sapiente iusto sed voluptates ut?`, author: "Hieu Max", publishDate: "12/09/2024"},
    {name: "New 13", href: '/', activity: "Hoạt động của trường", title: "Nghiên cứu 13", content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora debitis necessitatibus iure, quo eveniet consequatur, illum maxime laboriosam et amet quos blanditiis ipsam porro enim sapiente iusto sed voluptates ut?`, author: "Hieu Max", publishDate: "12/09/2024"},
  ]
  const Log = {
    data: card,
    parent: "Home"
  }

  return (
    <div className="py-3 px-3 h-full">
        <h1 className="text-2xl font-bold underline">Tin tức mới</h1>
        
        <div className="h-full max-w-full">
          <ListCard props={Log}/>
        </div>
    </div>
  )
}

export default Home