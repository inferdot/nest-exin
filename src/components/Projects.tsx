'use client'

import React, { useRef, useState, useEffect, FC } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react'
import db from "@/lib/database"

interface IProjects {
  $id: string
  project_name: string
  description: string
  image_url: string
}

const ImageModal: FC<{ src: string; alt: string; onClose: () => void }> = ({ src, alt, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="relative w-[90vw] h-[90vh] bg-white rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white rounded-full p-1 z-10"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src={src}
            alt={alt}
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>
      </div>
    </motion.div>
  )
}

const ProjectCard: FC<IProjects & { onImageClick: () => void }> = ({ project_name, description, image_url, onImageClick }) => {
  const [imgLoading, setImgLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setImgLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className="w-full h-full flex flex-col border bg-white dark:bg-gray-800 text-black transition-colors duration-300 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle>
          <h3 className="text-lg font-semibold leading-tight whitespace-pre-wrap break-words max-h-24 overflow-y-auto">
            {project_name}
          </h3>
        </CardTitle>
        <CardDescription>
          <p className="text-md text-gray-600 whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
            {description}
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="relative flex-grow">
        {imgLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-18 w-18 animate-spin" />
          </div>
        ) : (
            <div className="mx-auto flex justify-center items-center ">
            <Image
              src={image_url}
              width={350}
              height={450}
              alt={project_name}
              objectFit="cover"
              className="rounded-md cursor-pointer"
              onClick={onImageClick}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const Projects: FC = () => {
  const [projectsData, setProjectsData] = useState<IProjects[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const [visibleCards, setVisibleCards] = useState(1)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (window.innerWidth >= 1280) {
        setVisibleCards(3)
      } else if (window.innerWidth >= 768) {
        setVisibleCards(2)
      } else {
        setVisibleCards(1)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await db.projects.list()

      if (res.documents.length > 0) {
        setProjectsData(res.documents)
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current
    if (container) {
      const cardWidth = container.offsetWidth / visibleCards
      const newPosition = direction === 'left'
        ? Math.max(scrollPosition - cardWidth, 0)
        : Math.min(scrollPosition + cardWidth, (projectsData.length - visibleCards) * cardWidth)

      setScrollPosition(newPosition)
      container.scrollTo({ left: newPosition, behavior: 'smooth' })
    }
  }

  return (
    <>
      <div id="portfolio" className="py-2 my-10 scroll-mt-20">
        <div className="w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full flex justify-center items-center mb-6"
          >
            <h2 className="text-2xl font-bold">Projects</h2>
          </motion.div>

          <div className="relative w-full flex justify-center items-center">
            {!isMobile && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-10 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full shadow-lg bg-black/20 backdrop-blur-lg hover:bg-black/70 text-white z-10"
                aria-label="Scroll left"
              >
                <ChevronLeft size={24} className="mx-auto" />
              </button>
            )}

            <div className="w-[85%] overflow-hidden">
              <div
                ref={scrollRef}
                className={`flex transition-all duration-300 ease-in-out ${isMobile ? 'overflow-x-auto snap-x snap-mandatory' : ''}`}
                style={{
                  transform: isMobile ? 'none' : `translateX(-${scrollPosition}px)`,
                }}
              >
                {projectsData.map((project) => (
                  <div
                    key={project.$id}
                    className={`flex-shrink-0 px-2 ${isMobile ? 'w-[80vw] snap-center' : ''}`}
                    style={{ width: isMobile ? '80vw' : `${100 / visibleCards}%` }}
                  >
                    <ProjectCard
                      $id={project.$id}
                      project_name={project.project_name}
                      description={project.description}
                      image_url={project.image_url}
                      onImageClick={() => setSelectedImage({ src: project.image_url, alt: project.project_name })}
                    />
                  </div>
                ))}
              </div>
            </div>

            {!isMobile && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full shadow-lg bg-black/20 backdrop-blur-lg hover:bg-black/70 text-white z-10"
                aria-label="Scroll right"
              >
                <ChevronRight size={24} className="mx-auto" />
              </button>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {selectedImage && (
          <ImageModal
            src={selectedImage.src}
            alt={selectedImage.alt}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Projects
