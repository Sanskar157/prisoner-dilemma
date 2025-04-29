import Image from "next/image";

export default function About() {
  return (
    <section className="w-screen bg-black text-gray-200 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">About the Game</h2>
          <p className="text-gray-300 text-lg leading-relaxed py-8">
            The Prisoner’s Dilemma is a fundamental concept in game theory. It
            involves two players who must decide to cooperate or betray each
            other, leading to different outcomes. Despite mutual cooperation
            being the best collective choice, the dilemma arises from the
            temptation to betray. It has real-world applications in economics
            and social science, illustrating the challenges of cooperation and
            self-interest.
          </p>
          <Image
            src="/people.png" 
            alt="Illustration of Prisoner's Dilemma"
            width={800}
            height={600}
            className="rounded-lg shadow-lg mx-auto"
          />
        </div>
      </section>
  )
}